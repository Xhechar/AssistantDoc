import Router from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyAdmin, verifyToken } from '../middlewares/verify.tokens';

export const userRouter = Router();
const userController = new UserController();

// Register
userRouter.post('/register', async (req, res) => {
    await userController.registerUser(req, res);
});

// Login
userRouter.post('/login', async (req, res) => {
    await userController.loginUser(req, res);
});

// Get user by ID
userRouter.get('/getUserById/:userId', verifyToken, verifyAdmin, async (req, res) => {
    await userController.getUserById(req, res);
});

// Update user
userRouter.put('/updateUser/:userId', verifyToken, verifyAdmin, async (req, res) => {
    await userController.updateUser(req, res);
});

// Delete user
userRouter.delete('/deleteUser/:userId', verifyToken, verifyAdmin, async (req, res) => {
    await userController.deleteUser(req, res);
});