import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
    addStudent,
    studentLogin,
    getStudentDetails,
    markAttendance,
} from '../controllers/userController.js';
import verify from '../verify/verify.js';

const router = Router();

// Route for student sign-up
router.post('/sign-up', asyncHandler(addStudent));

// Route for student login
router.post('/sign-in', asyncHandler(studentLogin));

// Route to fetch student's subjects, teachers, subgroups, and attendance details
router.get('/details',verify, asyncHandler(getStudentDetails));

// Route to fetch subjects specifically for the logged-in student
// router.get('/subjects', verify, asyncHandler(getSubjectsForStudent));
// Route to mark attendance for a student
router.post('/mark-attendance',verify, asyncHandler(markAttendance));

export default router;
