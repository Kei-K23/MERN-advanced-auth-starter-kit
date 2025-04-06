import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
  verifyEmailSchema,
} from '../schemas/auth.schemas.js';
import AuthService from '../services/auth.services.js';
import { setCookie } from '../utils.js';

export default class AuthController {
  static signUp = async (req, res, next) => {
    try {
      const { name, email, password } = await signUpSchema.validateAsync(
        req.body,
      );

      const newUser = await AuthService.signUp(name, email, password);

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  static verifyEmail = async (req, res, next) => {
    try {
      const { email, verificationCode } = await verifyEmailSchema.validateAsync(
        req.body,
      );

      await AuthService.verifyEmail(email, verificationCode);

      res.status(200).json({
        success: true,
        message: 'Successfully verify your account',
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req, res, next) => {
    try {
      const { email, password } = await loginSchema.validateAsync(req.body);

      const token = await AuthService.login(email, password);

      // Set the access token cookie
      setCookie(
        res,
        'access_token',
        token,
        process.env.ACCESS_TOKEN_EXPIRES_IN,
      );
      res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken: token,
      });
    } catch (error) {
      next(error);
    }
  };

  static logout = async (_req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  };

  static forgotPassword = async (req, res, next) => {
    try {
      const { email } = await forgotPasswordSchema.validateAsync(req.body);

      await AuthService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Successfully send forgot password request',
      });
    } catch (error) {
      next(error);
    }
  };

  static resetPassword = async (req, res, next) => {
    try {
      const { email, verificationCode, newPassword } =
        await resetPasswordSchema.validateAsync(req.body);

      await AuthService.resetPassword(email, verificationCode, newPassword);

      res.status(200).json({
        success: true,
        message: 'Successfully reset your password',
      });
    } catch (error) {
      next(error);
    }
  };
}
