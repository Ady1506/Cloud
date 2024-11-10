import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import connection from '../config/db.js';

// Add a new teacher along with subjects, subgroups, and class schedules
const addTeacher = asyncHandler(async (req, res) => {
    const { teacherId, name, subjects } = req.body; // subjects: array of { subjectCode, subgroups: [subgroupIds], schedule: { day: 'Monday', startTime: '9:00', endTime: '10:00' } }

    // Check if teacher already exists
    const checkTeacherQuery = 'SELECT * FROM Teachers WHERE teacher_id = ?';
    connection.query(checkTeacherQuery, [teacherId], (err, data) => {
        if (err) {
            console.error('Error executing SELECT query:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }
        if (data.length > 0) {
            return res.status(400).json(new ApiResponse(400, 'Teacher already exists'));
        }

        // Insert teacher data
        const insertTeacherQuery = 'INSERT INTO Teachers (teacher_id, name) VALUES (?, ?)';
        connection.query(insertTeacherQuery, [teacherId, name], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json(new ApiResponse(500, 'Internal server error'));
            }

            // Assign subjects, subgroups, and class schedules to the teacher
            subjects.forEach(({ subjectCode, subgroups, schedule }) => {
                // Insert subject for teacher
                const insertSubjectQuery = 'INSERT INTO TeacherSubjects (teacher_id, subject_code) VALUES (?, ?)';
                connection.query(insertSubjectQuery, [teacherId, subjectCode], (err) => {
                    if (err) {
                        console.error('Error inserting subject:', err);
                        return res.status(500).json(new ApiResponse(500, 'Internal server error'));
                    }
                });

                // Insert subgroups for teacher and subject
                subgroups.forEach(subgroupId => {
                    const insertSubgroupQuery = 'INSERT INTO TeacherSubgroups (teacher_id, subject_code, subgroup_id) VALUES (?, ?, ?)';
                    connection.query(insertSubgroupQuery, [teacherId, subjectCode, subgroupId], (err) => {
                        if (err) {
                            console.error('Error inserting subgroup:', err);
                            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
                        }
                    });
                });

                // Insert schedule (time slots) for each subject taught by teacher
                if (schedule && schedule.day && schedule.startTime && schedule.endTime) {
                    const insertScheduleQuery = `
                        INSERT INTO ClassSchedules (subject_code, teacher_id, subgroup_id, day_of_week, start_time, end_time)
                        VALUES (?, ?, ?, ?, ?, ?)`;
                    schedule.subgroups.forEach(subgroupId => {
                        connection.query(insertScheduleQuery, [subjectCode, teacherId, subgroupId, schedule.day, schedule.startTime, schedule.endTime], (err) => {
                            if (err) {
                                console.error('Error inserting schedule:', err);
                                return res.status(500).json(new ApiResponse(500, 'Internal server error'));
                            }
                        });
                    });
                }
            });

            res.status(200).json(new ApiResponse(200, 'Teacher created successfully', { teacherId, name, subjects }));
        });
    });
});

// Get subjects, subgroups, and class schedules taught by a specific teacher
const getTeacherDetails = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;

    const query = `
        SELECT s.subject_code, s.name AS subject_name, sg.subgroup_id, sg.branch_id, sg.year_id, cs.day_of_week, cs.start_time, cs.end_time
        FROM TeacherSubjects ts
        JOIN Subjects s ON ts.subject_code = s.subject_code
        LEFT JOIN TeacherSubgroups tsg ON ts.teacher_id = tsg.teacher_id AND ts.subject_code = tsg.subject_code
        LEFT JOIN Subgroups sg ON tsg.subgroup_id = sg.subgroup_id
        LEFT JOIN ClassSchedules cs ON ts.subject_code = cs.subject_code AND ts.teacher_id = cs.teacher_id
        WHERE ts.teacher_id = ?
    `;

    connection.query(query, [teacherId], (err, data) => {
        if (err) {
            console.error('Error fetching teacher details:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }

        const subjects = data.reduce((acc, row) => {
            const { subject_code, subject_name, subgroup_id, branch_id, year_id, day_of_week, start_time, end_time } = row;

            if (!acc[subject_code]) {
                acc[subject_code] = {
                    subjectCode: subject_code,
                    subjectName: subject_name,
                    subgroups: []
                };
            }

            if (subgroup_id) {
                acc[subject_code].subgroups.push({
                    subgroupId: subgroup_id,
                    branchId: branch_id,
                    yearId: year_id
                });
            }

            // Assign schedules to each subject
            if (day_of_week && start_time && end_time) {
                if (!acc[subject_code].schedules) acc[subject_code].schedules = [];
                acc[subject_code].schedules.push({
                    dayOfWeek: day_of_week,
                    startTime: start_time,
                    endTime: end_time
                });
            }

            return acc;
        }, {});

        res.status(200).json(new ApiResponse(200, 'Teacher details fetched successfully', Object.values(subjects)));
    });
});

// Teacher login
const teacherLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Fetch teacher by email
    const query = 'SELECT * FROM Teachers WHERE email = ?';
    connection.query(query, [email], (err, data) => {
        if (err) {
            console.error('Error executing login query:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }

        if (data.length === 0) {
            return res.status(400).json(new ApiResponse(400, 'Teacher not found'));
        }

        const teacher = data[0];
        // Check if password is correct
        if (!bcrypt.compareSync(password, teacher.password)) {
            return res.status(400).json(new ApiResponse(400, 'Invalid password'));
        }

        generateToken(res, teacher.teacher_id);

        res.status(200).json(new ApiResponse(200, 'Login successful', {
            id: teacher.teacher_id,
            name: teacher.name,
            type: 'teacher',
        }));
    });
});

// Update teacher's assigned subgroups for a specific subject
const updateTeacherSubgroups = asyncHandler(async (req, res) => {
    const { teacherId, subjectCode } = req.params;
    const { subgroups } = req.body; // Expected to be an array of subgroup IDs

    // First, delete existing subgroups for the teacher and subject
    const deleteQuery = 'DELETE FROM TeacherSubgroups WHERE teacher_id = ? AND subject_code = ?';
    connection.query(deleteQuery, [teacherId, subjectCode], (err) => {
        if (err) {
            console.error('Error deleting subgroups:', err);
            return res.status(500).json(new ApiResponse(500, 'Internal server error'));
        }

        // Insert new subgroups
        subgroups.forEach(subgroupId => {
            const insertSubgroupQuery = 'INSERT INTO TeacherSubgroups (teacher_id, subject_code, subgroup_id) VALUES (?, ?, ?)';
            connection.query(insertSubgroupQuery, [teacherId, subjectCode, subgroupId], (err) => {
                if (err) {
                    console.error('Error inserting subgroup:', err);
                    return res.status(500).json(new ApiResponse(500, 'Internal server error'));
                }
            });
        });

        res.status(200).json(new ApiResponse(200, 'Subgroups updated successfully', { teacherId, subjectCode, subgroups }));
    });
});

export { addTeacher, getTeacherDetails, teacherLogin, updateTeacherSubgroups };
