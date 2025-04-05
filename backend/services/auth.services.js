import { sendEmail } from '../config/email.js';
import { VERIFICATION_EMAIL_TEMPLATE } from '../config/emailTemplates.js';
import BadRequestError from '../exceptions/BadRequestError.js';
import Token from '../models/token.model.js';
import User from '../models/user.model.js';
import { generateRandomNumbers } from '../utils.js';

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

    // Handle email sending for account verification code
    const token = generateRandomNumbers().toString();
    await Token.create({
      token,
      userId: newUser._id,
      type: 'VERIFY_EMAIL',
      expireIn: Date.now() + 900000, // 15 minutes
    });

    const emailTemplate = VERIFICATION_EMAIL_TEMPLATE.replace(
      '{{verificationCode}}',
      token,
    )
      .replace('{{verifyLink}}', '') // TODO User actual frontend route
      .replace('{{name}}', newUser.name);

    // Send email verification
    sendEmail('Verify your email', emailTemplate, 'Email Verification', [
      {
        email: newUser.email,
      },
    ]);
    return newUser;
  };
}
