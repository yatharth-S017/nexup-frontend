import api from './api.js';

const normalizeEmail = (email) => email.trim().toLowerCase();

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email: normalizeEmail(email), password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', {
      ...userData,
      email: normalizeEmail(userData.email),
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email: normalizeEmail(email) });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email: normalizeEmail(email), otp });
    return response.data;
  },

  resetPassword: async (resetToken, newPassword) => {
    const response = await api.post('/auth/reset-password', { resetToken, newPassword });
    return response.data;
  },
};
