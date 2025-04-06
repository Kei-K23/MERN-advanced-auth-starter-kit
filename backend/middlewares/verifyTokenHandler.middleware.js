import Unauthorized from '../exceptions/Unauthorized.js';
import { verifyAccessToken } from '../utils.js';

export const verifyToken = (req, _res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new Unauthorized('Unauthorized - no access token provided');
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new Unauthorized('Unauthorized - invalid token');
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(error);
  }
};
