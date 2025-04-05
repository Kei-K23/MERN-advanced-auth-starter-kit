import { signUpSchema, verifyEmailSchema } from '../schemas/auth.schemas.js';
import AuthService from '../services/auth.services.js';

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
}
