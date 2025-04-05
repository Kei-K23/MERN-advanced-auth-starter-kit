import BadRequestError from '../exceptions/BadRequestError.js';
import User from '../models/user.model.js';

export default class AuthService {
  static signUp = async (name, email, password) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is already taken');
    }

    const newUser = (
      await User.create({ name, email, password, role: 'USER' })
    ).toObject();
    // Delete the password field
    delete newUser.password;

    return newUser;
  };
}
