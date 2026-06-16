import api from './api';

export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const verifyOtp = (otpData) => {
  return api.post('/auth/verify-otp', otpData);
};

export const refreshToken = (data) => {
  return api.post('/auth/refresh', data);
};

export const resendOtp = (email) => {
  return api.post('/auth/resend-otp', { email });
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data);
};
