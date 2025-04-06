import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';
import AuthController from '../controllers/auth.controllers.js';

const router = Router();

router.post('/sign-up', asyncHandler(AuthController.signUp));
router.post('/login', asyncHandler(AuthController.login));
router.post('/logout', asyncHandler(AuthController.logout));
router.post('/verify-email', asyncHandler(AuthController.verifyEmail));

export default router;
