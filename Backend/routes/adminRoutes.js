import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
    addTeacher,
    teacherLogin,
    getTeacherDetails,
    updateTeacherSubgroups,
    markAttendance,
    getAttendanceDetails,
} from '../controllers/adminController.js';
import verify from '../verify/verify.js';

const router = Router();

// Route for teacher sign-up
router.post('/sign-up', asyncHandler(addTeacher));

// Route for teacher login
router.post('/sign-in', asyncHandler(teacherLogin));

// Route to fetch teacher's details, including subjects, subgroups, etc.
router.get('/details',verify, asyncHandler(getTeacherDetails));

// Route to update a teacher's assigned subgroups for a subject
router.post('/:teacherId/update-subgroups/:subjectCode', asyncHandler(updateTeacherSubgroups));
// router.post('/mark-attendance', asyncHandler(markAttendance));
router.post('/attendance/:subjectCode/:subgroupId',verify, asyncHandler(markAttendance));
router.get('/attendance/:subjectCode/:subgroupId/:date', verify, asyncHandler(getAttendanceDetails));


export default router;
