import { sendEmail } from '../config/email.js';
import { VERIFICATION_EMAIL_TEMPLATE } from '../config/emailTemplates.js';
import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import Unauthorized from '../exceptions/Unauthorized.js';
import Token from '../models/token.model.js';
import User from '../models/user.model.js';
import { generateAccessToken, generateRandomNumbers } from '../utils.js';

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

  static verifyEmail = async (email, verificationCode) => {
    const existingUser = await User.findOne({ email, isVerified: false });

    if (!existingUser) {
      throw new NotFoundError('User not found or user already verified');
    }

    // Get the token and check token is valid
    const tokenDoc = await Token.findOne({
      userId: existingUser._id,
      token: verificationCode,
      expireIn: {
        $gt: Date.now(),
      },
    });

    if (!tokenDoc) {
      throw new BadRequestError('Token is expired or invalid');
    }

    existingUser.isVerified = true;
    // Update user isVerified status
    await existingUser.save();
    // Delete the token for clean-up
    await tokenDoc.deleteOne();
  };

  static login = async (email, password) => {
    const existingUser = await User.findOne({ email });

    if (!existingUser.isVerified) {
      throw new BadRequestError(
        'User account is not verify yet. Please verify the account first',
      );
    }

    if (!existingUser || !(await existingUser.comparePassword(password))) {
      throw new Unauthorized('Invalid login credentials');
    }

    return generateAccessToken(existingUser.id);
  };
}
