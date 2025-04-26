import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { verifyAdmin, verifyToken } from '../middlewares/verify.tokens';

export const enrollmentRouter = Router();
const enrollmentController = new EnrollmentController();

// Enroll Patient
enrollmentRouter.post('/enrollPatient', verifyToken, verifyAdmin, async (req, res) => {
    await enrollmentController.enrollPatient(req, res);
});

// Toggle Enrollment Status
enrollmentRouter.put('/toggle-status/:enrollmentId', verifyToken, verifyAdmin, async (req, res) => {
    await enrollmentController.toggleEnrollmentStatus(req, res);
});

// Delete Enrollment
enrollmentRouter.delete('/deleteEnrollment/:enrollmentId', verifyToken, verifyAdmin, async (req, res) => {
    await enrollmentController.deleteEnrollment(req, res);
});

// Get Enrollment By Id
enrollmentRouter.get('/getEnrollmentById/:enrollmentId', verifyToken, verifyAdmin, async (req, res) => {
    await enrollmentController.getEnrollmentById(req, res);
});

// Get All Enrollments
enrollmentRouter.get('/getAllEnrollments', verifyToken, verifyAdmin, async (req, res) => {
    await enrollmentController.getAllEnrollments(req, res);
});
