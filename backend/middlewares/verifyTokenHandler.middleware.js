import Unauthorized from '../exceptions/Unauthorized.js';
import { verifyAccessToken } from '../utils.js';

export const verifyToken = (req, _res, next) => {
  try {
    const accessToken = req?.cookies?.access_token;

    if (!accessToken) {
      throw new Unauthorized('Unauthorized - no access token provided');
    }

    const decoded = verifyAccessToken(accessToken);

    if (!decoded) {
      throw new Unauthorized('Unauthorized - invalid token');
    }

    req.user.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};
