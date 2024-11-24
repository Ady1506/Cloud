import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../config/db.js'; // Make sure to import the database connection

// Add a new student
const addStudent = asyncHandler(async (req, res) => {
    const { studentId, name, email, password, subgroupId } = req.body;

    try {
        // Validate incoming parameters
        if (!studentId || !name || !email || !password) {
            return res.status(400).json(new ApiResponse(400, 'All fields are required.'));
        }

        const connection = await connectToDatabase();

        // Check if student already exists
        const [existingStudent] = await connection.execute(
            'SELECT * FROM students WHERE student_id = ?',
            [studentId]
        );

        if (existingStudent.length > 0) {
            return res.status(400).json(new ApiResponse(400, 'Student already exists.'));
        }

        // Hash the password for security
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert new student into the database
        await connection.execute(
            'INSERT INTO students (student_id, student_name, roll_number, email, password, subgroup_id) VALUES (?, ?, ?, ?, ?, ?)',
            [
                studentId,
                name,
                studentId, // Assuming roll_number is same as student_id
                email,
                hashedPassword,
                subgroupId || null // Null if subgroupId is not provided
            ]
        );

        res.status(201).json(new ApiResponse(201, 'Student created successfully.', { studentId, name, email }));
        await connection.end(); // Close connection
    } catch (err) {
        console.error('Error in addStudent:', err.message);
        res.status(500).json(new ApiResponse(500, `Internal server error: ${err.message}`));
    }
});

const studentLogin = asyncHandler(async (req, res) => {
    const { roll_number, password } = req.body;  // Assuming you're using roll_number for login

    try {
        // Get a database connection
        const connection = await connectToDatabase();

        // Query to fetch student details using roll_number
        const [rows] = await connection.execute('SELECT * FROM students WHERE roll_number = ?', [roll_number]);

        // Close the database connection
        await connection.end();

        // Check if student exists
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const student = rows[0];

        // Verify password (hashed password comparison)
        if (!bcrypt.compareSync(password, student.password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate a JWT token and set it in the cookie
        generateToken(res, student.student_id);  // Pass the response object to generateToken

        res.status(200).json({
            message: 'Login successful',
            studentId: student.student_id,
            name: student.student_name,
            rollNumber: student.roll_number,
            // No need to send token in body, it's in the cookie now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const getStudentDetails = asyncHandler(async (req, res) => {
    const studentId = req.user; // Extracted from authMiddleware

    try {
        const connection = await connectToDatabase();

        const [data] = await connection.execute(`
            SELECT st.student_id, st.student_name, st.email, s.subject_code, s.subject_name, t.teacher_id, t.teacher_name, 
                   sg.subgroup_id, sg.branch_id, sg.year_id, a.date AS attendance_date, a.status AS attendance_status
            FROM students st
            JOIN subgroups sg ON st.subgroup_id = sg.subgroup_id
            JOIN teacher_subgroups tsg ON sg.subgroup_id = tsg.subgroup_id
            JOIN teacher_subjects ts ON tsg.teacher_id = ts.teacher_id AND tsg.subject_code = ts.subject_code
            JOIN subjects s ON ts.subject_code = s.subject_code
            JOIN teachers t ON ts.teacher_id = t.teacher_id
            LEFT JOIN attendance a ON st.student_id = a.student_id AND s.subject_code = a.subject_code
            WHERE st.student_id = ?
        `, [studentId]);

        if (data.length === 0) {
            return res.status(404).json(new ApiResponse(404, 'No data found for this student.'));
        }

        const subjects = data.reduce((acc, row) => {
            const { subject_code, subject_name, teacher_id, teacher_name, subgroup_id, branch_id, year_id, attendance_date, attendance_status } = row;

            if (!acc[subject_code]) {
                acc[subject_code] = {
                    subjectCode: subject_code,
                    subjectName: subject_name,
                    teacher: { teacherId: teacher_id, teacherName: teacher_name },
                    subgroups: [],
                    attendance: [],
                };
            }

            acc[subject_code].subgroups.push({ subgroupId: subgroup_id, branchId: branch_id, yearId: year_id });

            if (attendance_date) {
                const dateInIST = new Date(attendance_date);
                dateInIST.setHours(dateInIST.getHours() + 5);
                dateInIST.setMinutes(dateInIST.getMinutes() + 30);
                acc[subject_code].attendance.push({
                    date: dateInIST.toLocaleDateString('en-IN'),
                    status: attendance_status,
                });
            }

            return acc;
        }, {});

        const studentDetails = {
            studentId,
            name: data[0].student_name,
            email: data[0].email,
            subjects: Object.values(subjects),
        };

        res.status(200).json(new ApiResponse(200, 'Student details fetched successfully', studentDetails));
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json(new ApiResponse(500, 'Internal server error.'));
    }
});


const markAttendance = asyncHandler(async (req, res) => {
    const { studentId, subjectCode, date, status } = req.body;

    // Validate required parameters
    if (!studentId || !subjectCode || !date || !status) {
        return res.status(400).json({
            status: 400,
            message: "All fields (studentId, subjectCode, date, status) are required."
        });
    }

    try {
        const connection = await connectToDatabase();

        console.log("Request Parameters:", { studentId, subjectCode, date, status }); // Debug log

        // Check if attendance already exists
        const [data] = await connection.execute(
            'SELECT * FROM attendance WHERE student_id = ? AND subject_code = ? AND date = ?',
            [studentId, subjectCode, date]
        );

        if (data.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Attendance already marked for this date."
            });
        }

        // Insert new attendance record
        await connection.execute(
            'INSERT INTO attendance (student_id, subject_code, date, status) VALUES (?, ?, ?, ?)',
            [studentId, subjectCode, date, status]
        );

        res.status(200).json({
            status: 200,
            message: "Attendance marked successfully.",
            data: { studentId, subjectCode, date, status }
        });

        await connection.end();
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            status: 500,
            message: "Internal server error."
        });
    }
});


export { addStudent, studentLogin, getStudentDetails, markAttendance };
