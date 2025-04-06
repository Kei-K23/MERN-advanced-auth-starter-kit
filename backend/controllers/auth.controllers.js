import {
  loginSchema,
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
      setCookie(res, token, process.env.ACCESS_TOKEN_EXPIRES_IN);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken: token,
      });
    } catch (error) {
      next(error);
    }
  };
}
