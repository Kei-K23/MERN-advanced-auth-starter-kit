import ApiError from './ApiError.js';

export default class Unauthorized extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}
