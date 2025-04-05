import ApiError from './ApiError.js';

export default class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}
