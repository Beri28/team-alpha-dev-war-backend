import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  deleteAccount,
  getVerificationStatus,
  getAllUsers,
  getUserById
} from '../controller/user.controller.js';
import { authenticateUser, checkAdmin } from '../middleware/auth.middleware.js';

const userRouter = Router();

// Protected user routes
userRouter.get('/profile', authenticateUser, getUserProfile);
userRouter.put('/profile', authenticateUser, updateProfile);
userRouter.delete('/delete', authenticateUser, deleteAccount);
userRouter.get('/verification-status', authenticateUser, getVerificationStatus);

// Admin-only routes
userRouter.get('/all', authenticateUser, checkAdmin, getAllUsers);
userRouter.get('/:userId', authenticateUser, checkAdmin, getUserById);

export default userRouter;