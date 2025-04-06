import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';
import AuthController from '../controllers/auth.controllers.js';
import { verifyToken } from '../middlewares/verifyTokenHandler.middleware.js';

const router = Router();

router.post('/sign-up', asyncHandler(AuthController.signUp));
router.post('/login', asyncHandler(AuthController.login));
router.post('/logout', asyncHandler(AuthController.logout));
router.post('/verify-email', asyncHandler(AuthController.verifyEmail));
router.post('/forgot-password', asyncHandler(AuthController.forgotPassword));
router.post('/reset-password', asyncHandler(AuthController.resetPassword));
router.get('/me', verifyToken, asyncHandler(AuthController.getMe));
router.patch('/me', verifyToken, asyncHandler(AuthController.updateMe));
router.delete('/me', verifyToken, asyncHandler(AuthController.deleteMe));

export default router;
