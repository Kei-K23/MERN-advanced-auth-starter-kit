import axios from 'axios';
import { siteConfig } from '../config';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: siteConfig.BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(siteConfig.ACCESS_TOKEN_COOKIE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (data) => api.post('/auth/login', data),

  register: ({ name, email, password }) =>
    api.post('/auth/sign-up', {
      email,
      name,
      password,
    }),

  verifyEmail: ({ email, verificationCode }) =>
    api.post('/auth/verify-email', { email, verificationCode }),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),

  getProfile: () => api.get('/auth/me'),

  updateProfile: (name, email) => api.patch('/auth/me', { name, email }),

  deleteAccount: () => api.delete('/auth/me'),

  logout: () => api.post('/auth/logout'),
};

export default api;
