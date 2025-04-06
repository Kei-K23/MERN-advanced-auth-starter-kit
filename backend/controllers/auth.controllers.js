import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
  updateUserSchema,
  verifyEmailSchema,
} from '../schemas/auth.schemas.js';
import AuthService from '../services/auth.services.js';

export default class AuthController {
  static signUp = async (req, res, next) => {
    try {
      const { name, email, password } = await signUpSchema.validateAsync(
        req.body,
      );

      const newUser = await AuthService.signUp(
        name,
        email,
        password,
        req.ip,
        req.headers['user-agent'],
      );

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

      await AuthService.verifyEmail(
        email,
        verificationCode,
        req.ip,
        req.headers['user-agent'],
      );

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

      const token = await AuthService.login(
        email,
        password,
        req.ip,
        req.headers['user-agent'],
      );

      // Set the access token cookie
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

      await AuthService.forgotPassword(
        email,
        req.ip,
        req.headers['user-agent'],
      );

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

      await AuthService.resetPassword(
        email,
        verificationCode,
        newPassword,
        req.ip,
        req.headers['user-agent'],
      );

      res.status(200).json({
        success: true,
        message: 'Successfully reset your password',
      });
    } catch (error) {
      next(error);
    }
  };

  static getMe = async (req, res, next) => {
    try {
      const { id } = req.user;
      const user = await AuthService.getMe(id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  static updateMe = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { name, email } = await updateUserSchema.validateAsync(req.body);
      const user = await AuthService.updateMe(id, name, email);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  static deleteMe = async (req, res, next) => {
    try {
      const { id } = req.user;
      const user = await AuthService.deleteMe(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
