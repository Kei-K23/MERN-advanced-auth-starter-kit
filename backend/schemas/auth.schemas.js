import Joi from 'joi';

export const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(18).required(),
});

export const verifyEmailSchema = Joi.object({
  email: Joi.string().email().required(),
  verificationCode: Joi.string().required(),
});
