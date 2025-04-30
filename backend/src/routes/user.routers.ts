import Router from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyAdmin, verifyToken } from '../middlewares/verify.tokens';

export const userRouter = Router();
const userController = new UserController();

// Register
userRouter.post('/register', userController.registerUser);

// Login
userRouter.post('/login', async (req, res) => {
    await userController.loginUser(req, res);
});

userRouter.post('/logout', async (req, res) => {
    await userController.logoutUser(req, res);
});

// Get user by ID
userRouter.get('/getUserById', verifyToken, verifyAdmin, async (req, res) => {
    await userController.getUserById(req, res);
});

// Update user
userRouter.put('/updateUser', verifyToken, verifyAdmin, async (req, res) => {
    await userController.updateUser(req, res);
});

// Delete user
userRouter.delete('/deleteUser/:userId', verifyToken, verifyAdmin, async (req, res) => {
    await userController.deleteUser(req, res);
});