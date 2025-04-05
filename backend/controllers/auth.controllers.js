import { signUpSchema } from '../schemas/auth.schemas.js';
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
}
