import { Router } from 'express';
import { addStudent, studentLogin, getStudentDetails, markAttendance } from '../controllers/userController.js';

const router = Router();

// Route for student sign-up
router.route('/sign-up').post(
    addStudent
);

// Route for student login
router.route('/sign-in').post(
    studentLogin
);

// Route to fetch student's subjects, teachers, subgroups, and attendance details
router.route('/:studentId/details').get(
    getStudentDetails
);

// Route to mark attendance for a student
router.route('/mark-attendance').post(
    markAttendance
);

export default router;
