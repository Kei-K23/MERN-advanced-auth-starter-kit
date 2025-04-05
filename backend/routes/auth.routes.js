import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';
import AuthController from '../controllers/auth.controllers.js';

const router = Router();

router.post('/sign-up', asyncHandler(AuthController.signUp));

export default router;
