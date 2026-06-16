import api from './api';

export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getOrders = (params) => {
  return api.get('/orders', { params });
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}/status`, { status });
};

export const cancelOrder = (id, reason) => {
  return api.post(`/orders/${id}/cancel`, { reason });
};

export const trackOrder = (id) => {
  return api.get(`/orders/${id}/track`);
};

export const getOrderHistory = (params) => {
  return api.get('/orders/history', { params });
};

export const reorder = (orderId) => {
  return api.post(`/orders/${orderId}/reorder`);
};

export const rateOrder = (orderId, data) => {
  return api.post(`/orders/${orderId}/rate`, data);
};

export const getActiveOrders = () => {
  return api.get('/orders/active');
};
