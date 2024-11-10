import { Router } from 'express';
import { addTeacher, teacherLogin, getTeacherDetails, updateTeacherSubgroups } from '../controllers/adminController.js';

const router = Router();

// Route for teacher sign-up
router.route('/sign-up').post(
    addTeacher
);

// Route for teacher login
router.route('/sign-in').post(
    teacherLogin
);

// Route to fetch teacher's details, including subjects, subgroups, etc.
router.route('/:teacherId/details').get(
    getTeacherDetails
);

// Route to update a teacher's assigned subgroups for a subject
router.route('/:teacherId/update-subgroups/:subjectCode').post(
    updateTeacherSubgroups
);

export default router;
