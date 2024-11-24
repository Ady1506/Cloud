import connectToDatabase from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// Add a new teacher along with subjects, subgroups, and class schedules
// const addTeacher = asyncHandler(async (req, res) => {
//     const { teacherId, name, email, password, subjects } = req.body; // subjects: array of { subjectCode, subgroups: [subgroupIds], schedule: { day: 'Monday', startTime: '9:00', endTime: '10:00' } }

//     let connection;

//     try {
//         // Connect to the database
//         connection = await connectToDatabase();

//         // Check if teacher already exists
//         const checkTeacherQuery = 'SELECT * FROM Teachers WHERE teacher_id = ?';
//         const [teacherData] = await connection.query(checkTeacherQuery, [teacherId]);

//         if (teacherData.length > 0) {
//             return res.status(400).json(new ApiResponse(400, 'Teacher already exists'));
//         }

//         // Insert teacher data
//         const insertTeacherQuery = 'INSERT INTO Teachers (teacher_id, teacher_name, email, password) VALUES (?, ?, ?, ?)';
//         const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password for security

//         await connection.query(insertTeacherQuery, [teacherId, name, email, hashedPassword]);

//         // Assign subjects, subgroups, and class schedules to the teacher
//         for (const { subjectCode, subgroups, schedule } of subjects) {
//             // Insert subject for teacher
//             const insertSubjectQuery = 'INSERT INTO teacher_subjects (teacher_id, subject_code) VALUES (?, ?)';
//             await connection.query(insertSubjectQuery, [teacherId, subjectCode]);

//             // Insert subgroups for teacher and subject
//             for (const subgroupId of subgroups) {
//                 const insertSubgroupQuery = 'INSERT INTO teacher_subgroups (teacher_id, subject_code, subgroup_id) VALUES (?, ?, ?)';
//                 await connection.query(insertSubgroupQuery, [teacherId, subjectCode, subgroupId]);
//             }

//             // Insert schedule (time slots) for each subject taught by teacher
//             if (schedule && schedule.day && schedule.startTime && schedule.endTime) {
//                 const insertScheduleQuery = `
//                     INSERT INTO ClassSchedules (subject_code, teacher_id, subgroup_id, day_of_week, start_time, end_time)
//                     VALUES (?, ?, ?, ?, ?, ?)`;
//                 for (const subgroupId of schedule.subgroups) {
//                     await connection.query(insertScheduleQuery, [subjectCode, teacherId, subgroupId, schedule.day, schedule.startTime, schedule.endTime]);
//                 }
//             }
//         }

//         res.status(200).json(new ApiResponse(200, 'Teacher created successfully', { teacherId, name, subjects }));

//     } catch (err) {
//         console.error('Error adding teacher:', err);
//         res.status(500).json(new ApiResponse(500, 'Internal server error'));
//     } finally {
//         if (connection) {
//             connection.end(); // Always close the connection after use
//         }
//     }
// });
const addTeacher = asyncHandler(async (req, res) => {
    const { teacherId, name, email, password, subjects } = req.body; // `subjects` is an array of { subjectCode, subgroups: [subgroupIds] }

    let connection;

    try {
        // Connect to the database
        connection = await connectToDatabase();

        // Check if teacher already exists
        const checkTeacherQuery = 'SELECT * FROM teachers WHERE teacher_id = ?';
        const [teacherData] = await connection.query(checkTeacherQuery, [teacherId]);

        if (teacherData.length > 0) {
            return res.status(400).json(new ApiResponse(400, 'Teacher already exists'));
        }

        // Hash the password before storing it
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert teacher data
        const insertTeacherQuery = `
            INSERT INTO teachers (teacher_id, teacher_name, email, password) 
            VALUES (?, ?, ?, ?)
        `;
        await connection.query(insertTeacherQuery, [teacherId, name, email, hashedPassword]);

        // Assign subjects and subgroups to the teacher
        for (const { subjectCode, subgroups } of subjects) {
            // Insert into `teacher_subjects`
            const insertSubjectQuery = 'INSERT INTO teacher_subjects (teacher_id, subject_code) VALUES (?, ?)';
            await connection.query(insertSubjectQuery, [teacherId, subjectCode]);

            // Insert into `teacher_subgroups`
            for (const subgroupId of subgroups) {
                const insertSubgroupQuery = 'INSERT INTO teacher_subgroups (teacher_id, subject_code, subgroup_id) VALUES (?, ?, ?)';
                await connection.query(insertSubgroupQuery, [teacherId, subjectCode, subgroupId]);
            }
        }

        res.status(200).json(new ApiResponse(200, 'Teacher created successfully', { teacherId, name, email, subjects }));
    } catch (err) {
        console.error('Error adding teacher:', err);
        res.status(500).json(new ApiResponse(500, 'Internal server error'));
    } finally {
        if (connection) {
            connection.end(); // Always close the connection after use
        }
    }
});


// Get subjects, subgroups, and class schedules taught by a specific teacher
const getTeacherDetails = asyncHandler(async (req, res) => {
    const teacherId= req.user;

    let connection;

    try {
        // Connect to the database
        connection = await connectToDatabase();

        const query = `
            SELECT t.teacher_id, t.teacher_name, t.email, 
                   s.subject_code, s.subject_name, sg.subgroup_id, sg.branch_id, sg.year_id
            FROM teacher_subjects ts
            JOIN subjects s ON ts.subject_code = s.subject_code
            LEFT JOIN teacher_subgroups tsg ON ts.teacher_id = tsg.teacher_id AND ts.subject_code = tsg.subject_code
            LEFT JOIN subgroups sg ON tsg.subgroup_id = sg.subgroup_id
            LEFT JOIN teachers t ON ts.teacher_id = t.teacher_id
            WHERE ts.teacher_id = ?`;

        const [data] = await connection.query(query, [teacherId]);

        // Check if teacher data is available
        if (data.length === 0) {
            return res.status(404).json(new ApiResponse(404, 'Teacher not found'));
        }

        // Extract the teacher's details and their subjects
        const teacherDetails = {
            teacherId: data[0].teacher_id,
            teacherName: data[0].teacher_name,
            email: data[0].email,
            subjects: []
        };

        data.forEach((row) => {
            const { subject_code, subject_name, subgroup_id, branch_id, year_id } = row;

            // Add subject to teacher's details
            teacherDetails.subjects.push({
                subjectCode: subject_code,
                subjectName: subject_name,
                subgroups: row.subgroup_id ? [{
                    subgroupId: row.subgroup_id,
                    branchId: row.branch_id,
                    yearId: row.year_id
                }] : []
            });
        });

        res.status(200).json(new ApiResponse(200, 'Teacher details fetched successfully', teacherDetails));

    } catch (err) {
        console.error('Error fetching teacher details:', err);
        res.status(500).json(new ApiResponse(500, 'Internal server error'));
    } finally {
        if (connection) {
            connection.end(); // Always close the connection after use
        }
    }
});



// Teacher login
const teacherLogin = asyncHandler(async (req, res) => {
    try {
        // Destructure the request body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json(new ApiResponse(400, 'Email and password are required'));
        }

        // Connect to the database
        const connection = await connectToDatabase();

        // Fetch teacher by email
        const query = 'SELECT * FROM teachers WHERE email = ?';
        const [data] = await connection.query(query, [email]);

        if (data.length === 0) {
            return res.status(400).json(new ApiResponse(400, 'Teacher not found'));
        }

        const teacher = data[0];

        // Validate the password
        const isPasswordValid = bcrypt.compareSync(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(400).json(new ApiResponse(400, 'Invalid password'));
        }

        // Extract relevant fields for the response and token
        const { teacher_id, teacher_name } = teacher;

        // Generate and send token
        generateToken(res, teacher_id);
        const token=generateToken(res, teacher_id);

        res.status(200).json(new ApiResponse(200, 'Login successful', {
            id: teacher_id,
            name: teacher_name,
            email: email,
            type: 'teacher',
            token:token
        }));

        connection.end(); // Close the connection

    } catch (err) {
        console.error('Error executing login query:', err);
        res.status(500).json(new ApiResponse(500, 'Internal server error'));
    }
});




// Update teacher's assigned subgroups for a specific subject
const updateTeacherSubgroups = asyncHandler(async (req, res) => {
    const { teacherId, subjectCode } = req.params;
    const { subgroups } = req.body; // Expected to be an array of subgroup IDs

    let connection;

    try {
        // Connect to the database
        connection = await connectToDatabase();

        // First, delete existing subgroups for the teacher and subject
        const deleteQuery = 'DELETE FROM teacher_subgroups WHERE teacher_id = ? AND subject_code = ?';
        await connection.query(deleteQuery, [teacherId, subjectCode]);

        // Insert new subgroups
        for (const subgroupId of subgroups) {
            const insertSubgroupQuery = 'INSERT INTO teacher_subgroups (teacher_id, subject_code, subgroup_id) VALUES (?, ?, ?)';
            await connection.query(insertSubgroupQuery, [teacherId, subjectCode, subgroupId]);
        }

        res.status(200).json(new ApiResponse(200, 'Subgroups updated successfully', { teacherId, subjectCode, subgroups }));

    } catch (err) {
        console.error('Error updating subgroups:', err);
        res.status(500).json(new ApiResponse(500, 'Internal server error'));
    } finally {
        if (connection) {
            connection.end(); // Always close the connection after use
        }
    }
});


// const markAttendance = asyncHandler(async (req, res) => {
//     const { teacherId, subjectCode, subgroupId } = req.params;
//     const { attendance } = req.body; // Expected to be an array of { studentId, status }

//     let connection;

//     try {
//         // Connect to the database
//         connection = await connectToDatabase();

//         // Validate that the teacher is assigned to the subject and subgroup
//         const validateQuery = `
//             SELECT * FROM teacher_subgroups 
//             WHERE teacher_id = ? AND subject_code = ? AND subgroup_id = ?`;
//         const [validationResult] = await connection.query(validateQuery, [teacherId, subjectCode, subgroupId]);

//         if (validationResult.length === 0) {
//             return res.status(403).json(new ApiResponse(403, 'Teacher is not assigned to this subject and subgroup'));
//         }

//         // Insert attendance records
//         const insertAttendanceQuery = `
//             INSERT INTO attendance (student_id, subject_code, teacher_id, date, status) 
//             VALUES (?, ?, ?, ?, ?)`;
//         const date = new Date().toISOString().split('T')[0]; // Current date

//         for (const { studentId, status } of attendance) {
//             await connection.query(insertAttendanceQuery, [studentId, subjectCode, teacherId, date, status]);
//         }

//         res.status(200).json(new ApiResponse(200, 'Attendance marked successfully'));

//     } catch (err) {
//         console.error('Error marking attendance:', err);
//         res.status(500).json(new ApiResponse(500, 'Internal server error'));
//     } finally {
//         if (connection) {
//             connection.end(); // Always close the connection after use
//         }
//     }
// });

const markAttendance = asyncHandler(async (req, res) => {
    const teacherId = req.user; // Extracted from `verify` middleware
    const { subjectCode, subgroupId } = req.params;
    const { attendance, date: providedDate } = req.body;

    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
        return res.status(400).json(new ApiResponse(400, 'Invalid or missing attendance data'));
    }

    // Use provided date or default to today's date
    const date = providedDate || new Date().toISOString().split('T')[0];

    let connection;

    try {
        connection = await connectToDatabase();

        // Validate teacher-subgroup assignment
        const validateQuery = `
            SELECT * FROM teacher_subgroups 
            WHERE teacher_id = ? AND subject_code = ? AND subgroup_id = ?`;
        const [validationResult] = await connection.query(validateQuery, [teacherId, subjectCode, subgroupId]);

        if (validationResult.length === 0) {
            return res.status(403).json(new ApiResponse(403, 'Teacher is not assigned to this subject and subgroup'));
        }

        await connection.beginTransaction();

        for (const { studentId, status } of attendance) {
            // Check if attendance already exists for the given student, subject, and date
            const [existingRecord] = await connection.query(
                `SELECT * FROM attendance WHERE student_id = ? AND subject_code = ? AND date = ?`,
                [studentId, subjectCode, date]
            );

            if (existingRecord.length > 0) {
                // Update existing attendance record
                await connection.query(
                    `UPDATE attendance SET status = ? WHERE student_id = ? AND subject_code = ? AND date = ?`,
                    [status, studentId, subjectCode, date]
                );
            } else {
                // Insert new attendance record
                await connection.query(
                    `INSERT INTO attendance (student_id, subject_code, date, status) 
                     VALUES (?, ?, ?, ?)`,
                    [studentId, subjectCode, date, status]
                );
            }
        }

        await connection.commit();
        res.status(200).json(new ApiResponse(200, `Attendance marked successfully for ${date}`));
    } catch (err) {
        console.error('Error marking attendance:', err);
        if (connection) await connection.rollback();
        res.status(500).json(new ApiResponse(500, 'Internal server error'));
    } finally {
        if (connection) connection.end();
    }
});



// const getAttendanceDetails = asyncHandler(async (req, res) => {
//     const teacherId = req.user; // Extracted from `verify` middleware
//     const { subjectCode, subgroupId, date: providedDate } = req.params;

//     let connection;

//     try {
//         // Connect to the database
//         connection = await connectToDatabase();

//         // Validate that the teacher is assigned to the subject and subgroup
//         const validateQuery = `
//             SELECT * FROM teacher_subgroups 
//             WHERE teacher_id = ? AND subject_code = ? AND subgroup_id = ?`;
//         const [validationResult] = await connection.query(validateQuery, [teacherId, subjectCode, subgroupId]);

//         if (validationResult.length === 0) {
//             return res.status(403).json(new ApiResponse(403, 'Teacher is not assigned to this subject and subgroup'));
//         }

//         // Use provided date or default to today's date
//         const date = new Date(providedDate) || new Date().toISOString().split('T')[0];

//         // Fetch attendance and student details for the given subject, subgroup, and date
//         const attendanceQuery = `
//             SELECT a.date, a.status, st.student_id, st.student_name, st.email AS student_email
//             FROM attendance a
//             JOIN students st ON a.student_id = st.student_id
//             WHERE a.subject_code = ? AND a.date = ? AND st.subgroup_id = ?`;
//         const [attendanceData] = await connection.query(attendanceQuery, [subjectCode, date, subgroupId]);

//         res.status(200).json(new ApiResponse(200, 'Attendance and student details fetched successfully', attendanceData));

//     } catch (err) {
//         console.error('Error fetching attendance details:', err);
//         res.status(500).json(new ApiResponse(500, 'Internal server error'));
//     } finally {
//         if (connection) {
//             connection.end(); // Always close the connection after use
//         }
//     }
// });

const getAttendanceDetails = asyncHandler(async (req, res) => {
    const teacherId = req.user; // Extracted from `verify` middleware
    const { subjectCode, subgroupId, date: providedDate } = req.params;

    let connection;

    try {
        // Connect to the database
        connection = await connectToDatabase();

        // Validate that the teacher is assigned to the subject and subgroup
        const validateQuery = `
            SELECT * FROM teacher_subgroups 
            WHERE teacher_id = ? AND subject_code = ? AND subgroup_id = ?`;
        const [validationResult] = await connection.query(validateQuery, [teacherId, subjectCode, subgroupId]);

        if (validationResult.length === 0) {
            return res.status(403).json(new ApiResponse(403, 'Teacher is not assigned to this subject and subgroup'));
        }

        // Use provided date or default to today's date
        const date = new Date(providedDate) || new Date().toISOString().split('T')[0];

        // Adjust the date to IST (UTC + 5:30)
        const dateInIST = new Date(date);
        dateInIST.setHours(dateInIST.getHours() + 5); // Add 5 hours for IST
        dateInIST.setMinutes(dateInIST.getMinutes() + 30); // Add 30 minutes for IST

        // Format the date to YYYY-MM-DD (MySQL expected format)
        const formattedDate = dateInIST.toISOString().split('T')[0];  // Get the date part in YYYY-MM-DD format

        console.log(formattedDate); // For debugging purposes

        // Fetch attendance and student details for the given subject, subgroup, and date
        const attendanceQuery = `
            SELECT a.date, a.status, st.student_id, st.student_name, st.email AS student_email
            FROM attendance a
            JOIN students st ON a.student_id = st.student_id
            WHERE a.subject_code = ? AND a.date = ? AND st.subgroup_id = ?`;
        const [attendanceData] = await connection.query(attendanceQuery, [subjectCode, formattedDate, subgroupId]);

        // Adjust the date for each record to IST
        const updatedAttendanceData = attendanceData.map((record) => {
            const dateInUTC = new Date(record.date); // Assuming `record.date` is in UTC
            dateInUTC.setHours(dateInUTC.getHours() + 5); // Add 5 hours for IST
            dateInUTC.setMinutes(dateInUTC.getMinutes() + 30); // Add 30 minutes for IST
            const formattedRecordDate = dateInUTC.toLocaleDateString('en-IN');  // Format the date to DD/MM/YYYY
            return {
                ...record,
                date: formattedRecordDate,  // Replace the date with the formatted IST date
            };
        });

        res.status(200).json(new ApiResponse(200, 'Attendance and student details fetched successfully', updatedAttendanceData));

    } catch (err) {
        console.error('Error fetching attendance details:', err);
        res.status(500).json(new ApiResponse(500, 'Internal server error'));
    } finally {
        if (connection) {
            connection.end(); // Always close the connection after use
        }
    }
});





export { addTeacher, getTeacherDetails, teacherLogin, updateTeacherSubgroups, markAttendance, getAttendanceDetails };
