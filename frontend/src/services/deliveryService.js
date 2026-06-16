import api from './api';

export const trackDelivery = (orderId) => {
  return api.get(`/delivery/track/${orderId}`);
};

export const getDeliveryStatus = (orderId) => {
  return api.get(`/delivery/status/${orderId}`);
};

export const assignDeliveryPartner = (orderId, partnerId) => {
  return api.post(`/delivery/assign`, { orderId, partnerId });
};

export const updateDeliveryLocation = (orderId, location) => {
  return api.patch(`/delivery/location/${orderId}`, location);
};

export const getDeliveryPartners = (params) => {
  return api.get('/delivery/partners', { params });
};

export const getDeliveryETA = (orderId) => {
  return api.get(`/delivery/eta/${orderId}`);
};

export const reportDeliveryIssue = (orderId, issueData) => {
  return api.post(`/delivery/issues/${orderId}`, issueData);
};

export const confirmDelivery = (orderId) => {
  return api.post(`/delivery/confirm/${orderId}`);
};

export const getDeliveryHistory = (params) => {
  return api.get('/delivery/history', { params });
};
