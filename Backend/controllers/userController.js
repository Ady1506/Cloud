import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import connection from '../config/db.js';

// Add a new student
const addStudent = asyncHandler(async (req, res) => {
    const { studentId, name, email, password, subgroupId } = req.body;

    // Check if student already exists
    const checkStudentQuery = 'SELECT * FROM Students WHERE student_id = ?';
    connection.query(checkStudentQuery, [studentId], (err, data) => {
        if (err) {
            console.error('Error executing SELECT query:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }
        if (data.length > 0) {
            return res.status(400).json(new ApiResponse(400, 'Student already exists'));
        }

        // Insert student data
        const insertStudentQuery = 'INSERT INTO Students (student_id, name, email, password, subgroup_id) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertStudentQuery, [studentId, name, email, bcrypt.hashSync(password, 10), subgroupId], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json(new ApiResponse(500, 'Internal server error'));
            }

            res.status(200).json(new ApiResponse(200, 'Student created successfully', { studentId, name, email }));
        });
    });
});

// Student login
const studentLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Fetch student by email
    const query = 'SELECT * FROM Students WHERE email = ?';
    connection.query(query, [email], (err, data) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }

        if (data.length === 0) {
            return res.status(400).json(new ApiResponse(400, 'Student not found'));
        }

        const student = data[0];
        // Check if password is correct
        if (!bcrypt.compareSync(password, student.password)) {
            return res.status(400).json(new ApiResponse(400, 'Invalid password'));
        }

        generateToken(res, student.student_id);

        res.status(200).json(new ApiResponse(200, 'Login successful', {
            id: student.student_id,
            name: student.name,
            type: 'student',
        }));
    });
});

// Get student's subjects, teachers, and attendance
const getStudentDetails = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    // Get subjects, teachers, subgroups, and attendance for a student
    const query = `
        SELECT s.subject_code, s.name AS subject_name, t.teacher_id, t.name AS teacher_name, sg.subgroup_id, sg.branch_id, sg.year_id, a.attendance_date, a.status AS attendance_status
        FROM Subgroups sg
        JOIN Students st ON sg.subgroup_id = st.subgroup_id
        JOIN TeacherSubgroups tsg ON sg.subgroup_id = tsg.subgroup_id
        JOIN TeacherSubjects ts ON tsg.teacher_id = ts.teacher_id AND tsg.subject_code = ts.subject_code
        JOIN Subjects s ON ts.subject_code = s.subject_code
        JOIN Teachers t ON ts.teacher_id = t.teacher_id
        LEFT JOIN Attendance a ON st.student_id = a.student_id AND s.subject_code = a.subject_code
        WHERE st.student_id = ?
    `;

    connection.query(query, [studentId], (err, data) => {
        if (err) {
            console.error('Error fetching student details:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }

        const subjects = data.reduce((acc, row) => {
            const { subject_code, subject_name, teacher_id, teacher_name, subgroup_id, branch_id, year_id, attendance_date, attendance_status } = row;

            if (!acc[subject_code]) {
                acc[subject_code] = {
                    subjectCode: subject_code,
                    subjectName: subject_name,
                    teacher: {
                        teacherId: teacher_id,
                        teacherName: teacher_name,
                    },
                    subgroups: [],
                    attendance: []
                };
            }

            // Assign subgroup information
            acc[subject_code].subgroups.push({
                subgroupId: subgroup_id,
                branchId: branch_id,
                yearId: year_id
            });

            // Assign attendance status
            if (attendance_date) {
                acc[subject_code].attendance.push({
                    date: attendance_date,
                    status: attendance_status,
                });
            }

            return acc;
        }, {});

        res.status(200).json(new ApiResponse(200, 'Student details fetched successfully', Object.values(subjects)));
    });
});

// Mark attendance for a student
const markAttendance = asyncHandler(async (req, res) => {
    const { studentId, subjectCode, date, status } = req.body;

    // Check if attendance for the student already exists for the subject on the given date
    const checkAttendanceQuery = 'SELECT * FROM Attendance WHERE student_id = ? AND subject_code = ? AND attendance_date = ?';
    connection.query(checkAttendanceQuery, [studentId, subjectCode, date], (err, data) => {
        if (err) {
            console.error('Error checking attendance:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }

        if (data.length > 0) {
            return res.status(400).json(new ApiResponse(400, 'Attendance already marked for this date'));
        }

        // Mark attendance for the student
        const insertAttendanceQuery = 'INSERT INTO Attendance (student_id, subject_code, attendance_date, status) VALUES (?, ?, ?, ?)';
        connection.query(insertAttendanceQuery, [studentId, subjectCode, date, status], (err) => {
            if (err) {
                console.error('Error marking attendance:', err);
                return res.status(500).json(new ApiResponse(500, 'Internal server error'));
            }

            res.status(200).json(new ApiResponse(200, 'Attendance marked successfully', { studentId, subjectCode, date, status }));
        });
    });
});

export { addStudent, studentLogin, getStudentDetails, markAttendance };
