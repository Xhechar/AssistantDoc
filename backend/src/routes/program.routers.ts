import { Router } from 'express';
import { ProgramController } from '../controllers/program.controller';
import { verifyToken, verifyAdmin } from '../middlewares/verify.tokens';

export const programRouter = Router();
const programController = new ProgramController();

// Create Program
programRouter.post('/createProgram', verifyToken, verifyAdmin, async (req, res) => {
    await programController.createProgram(req, res);
});

// Update Program
programRouter.put('/updateProgram/:programId', verifyToken, verifyAdmin, async (req, res) => {
    await programController.updateProgram(req, res);
});

// Delete Program
programRouter.delete('/deleteProgram/:programId', verifyToken, verifyAdmin, async (req, res) => {
    await programController.deleteProgram(req, res);
});

// Get Program By Id
programRouter.get('g/etProgramById/:programId', verifyToken, verifyAdmin, async (req, res) => {
    await programController.getProgramById(req, res);
});

// Get All Programs
programRouter.get('/getAllPrograms', verifyToken, verifyAdmin, async (req, res) => {
    await programController.getAllPrograms(req, res);
});
