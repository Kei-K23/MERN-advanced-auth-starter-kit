import mongoose from 'mongoose';
import ApiError from '../exceptions/ApiError.js';

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  console.log(error);

  // Handle App API Error
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Mongoose duplicate key errors
  else if (error.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${error.keyValue}`;
  } else if (error.code === 14) {
    statusCode = 400;
    message = `Type Mismatch`;
  }
  // Handle Mongoose duplicate key errors
  else if (error instanceof mongoose.Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
