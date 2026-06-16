import api from './api';

export const createPayment = (paymentData) => {
  return api.post('/payments', paymentData);
};

export const processPayment = (paymentId, paymentDetails) => {
  return api.post(`/payments/${paymentId}/process`, paymentDetails);
};

export const getPaymentStatus = (paymentId) => {
  return api.get(`/payments/${paymentId}/status`);
};

export const verifyPayment = (paymentData) => {
  return api.post('/payments/verify', paymentData);
};

export const getPaymentMethods = () => {
  return api.get('/payments/methods');
};

export const savePaymentMethod = (methodData) => {
  return api.post('/payments/methods', methodData);
};

export const deletePaymentMethod = (methodId) => {
  return api.delete(`/payments/methods/${methodId}`);
};

export const initiateRefund = (paymentId, reason) => {
  return api.post(`/payments/${paymentId}/refund`, { reason });
};

export const getPaymentHistory = (params) => {
  return api.get('/payments/history', { params });
};
