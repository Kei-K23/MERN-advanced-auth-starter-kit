import jwt from 'jsonwebtoken';

export const generateRandomNumbers = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
};

export const setCookie = (res, key, val, expiresIn) => {
  res.cookie(key, val, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiresIn,
  });
};
