import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { verifyToken, verifyAdmin } from '../middlewares/verify.tokens';

export const patientRouter = Router();
const patientController = new PatientController();

// Register Patient
patientRouter.post('/registerPatient', verifyToken, verifyAdmin, async (req, res) => {
    await patientController.registerPatient(req, res);
});

// Update Patient
patientRouter.put('/updatePatient/:patientId', verifyToken, verifyAdmin, async (req, res) => {
    await patientController.updatePatient(req, res);
});

// Delete Patient
patientRouter.delete('/deletePatient/:patientId', verifyToken, verifyAdmin, async (req, res) => {
    await patientController.deletePatient(req, res);
});

// Get Patient By Id
patientRouter.get('/getPatientById/:patientId', async (req, res) => {
    await patientController.getPatientById(req, res);
});

// Get All Patients
patientRouter.get('/getAllPatients', verifyToken, verifyAdmin, async (req, res) => {
    await patientController.getAllPatients(req, res);
});
