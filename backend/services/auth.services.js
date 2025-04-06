import { sendEmail } from '../config/email.js';
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_TEMPLATE,
} from '../config/emailTemplates.js';
import BadRequestError from '../exceptions/BadRequestError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import Unauthorized from '../exceptions/Unauthorized.js';
import Token from '../models/token.model.js';
import User from '../models/user.model.js';
import { UserActivityAction } from '../models/userActivity.model.js';
import { generateAccessToken, generateRandomNumbers } from '../utils.js';
import UserActivityService from './userActivity.services.js';

export default class AuthService {
  static signUp = async (name, email, password, ip, userAgent) => {
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
      user: newUser._id,
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

    await UserActivityService.create(
      newUser._id,
      UserActivityAction.Register,
      ip,
      userAgent,
    );

    return newUser;
  };

  static verifyEmail = async (email, verificationCode, ip, userAgent) => {
    const existingUser = await User.findOne({ email, isVerified: false });

    if (!existingUser) {
      throw new NotFoundError('User not found or user already verified');
    }

    // Get the token and check token is valid
    const tokenDoc = await Token.findOne({
      user: existingUser._id,
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

    // Send welcome email message
    const emailTemplate = WELCOME_TEMPLATE.replace(
      '{{name}}',
      existingUser.name,
    );
    sendEmail(
      'Welcome from the MERN Advanced Auth Starter Kit',
      emailTemplate,
      'Welcome Message',
      [
        {
          email: existingUser.email,
        },
      ],
    );

    await UserActivityService.create(
      existingUser._id,
      UserActivityAction['Email Verified'],
      ip,
      userAgent,
    );
  };

  static login = async (email, password, ip, userAgent) => {
    const existingUser = await User.findOne({ email });

    if (!existingUser.isVerified) {
      throw new BadRequestError(
        'User account is not verify yet. Please verify the account first',
      );
    }

    if (!existingUser || !(await existingUser.comparePassword(password))) {
      throw new Unauthorized('Invalid login credentials');
    }

    await UserActivityService.create(
      existingUser._id,
      UserActivityAction['Login'],
      ip,
      userAgent,
    );

    return generateAccessToken(existingUser.id);
  };

  static forgotPassword = async (email, ip, userAgent) => {
    const existingUser = await User.findOne({ email, isVerified: true });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Handle email sending for account verification code
    const token = generateRandomNumbers().toString();
    await Token.create({
      token,
      user: existingUser._id,
      type: 'FORGOT_PASSWORD',
      expireIn: Date.now() + 900000, // 15 minutes
    });

    const emailTemplate = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      '{{verificationCode}}',
      token,
    ).replace('{{name}}', existingUser.name);

    // Send email verification
    sendEmail(
      'Password Reset Request',
      emailTemplate,
      'Password Reset Request',
      [
        {
          email: existingUser.email,
        },
      ],
    );

    await UserActivityService.create(
      existingUser._id,
      UserActivityAction['Forgot Password Requested'],
      ip,
      userAgent,
    );
  };

  static resetPassword = async (
    email,
    verificationCode,
    newPassword,
    ip,
    userAgent,
  ) => {
    const existingUser = await User.findOne({ email, isVerified: true });

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Get the token and check token is valid
    const tokenDoc = await Token.findOne({
      user: existingUser._id,
      token: verificationCode,
      expireIn: {
        $gt: Date.now(),
      },
    });

    if (!tokenDoc) {
      throw new BadRequestError('Token is expired or invalid');
    }

    existingUser.password = newPassword;
    // Update user isVerified status
    await existingUser.save();
    // Delete the token for clean-up
    await tokenDoc.deleteOne();

    const emailTemplate = PASSWORD_RESET_SUCCESS_TEMPLATE.replace(
      '{{name}}',
      existingUser.name,
    );
    sendEmail(
      'Password Reset Successful',
      emailTemplate,
      'Password Reset Successful',
      [
        {
          email: existingUser.email,
        },
      ],
    );

    await UserActivityService.create(
      existingUser._id,
      UserActivityAction['Password Reset'],
      ip,
      userAgent,
    );
  };

  static getMe = async (userId) => {
    const existingUser = await User.findById(userId).lean();

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const activities = await UserActivityService.getActivitiesByUserId(
      existingUser._id,
    );

    // Delete the password field
    delete existingUser.password;

    return { ...existingUser, activities };
  };

  static updateMe = async (userId, name, email) => {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  };

  static deleteMe = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId, {
      new: true,
    });

    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }

    return deletedUser;
  };
}
