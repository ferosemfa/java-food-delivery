import api from './api';

export const getVendors = (params) => {
  return api.get('/vendors', { params });
};

export const getVendorById = (id) => {
  return api.get(`/vendors/${id}`);
};

export const createVendor = (data) => {
  return api.post('/vendors', data);
};

export const updateVendor = (id, data) => {
  return api.put(`/vendors/${id}`, data);
};

export const deleteVendor = (id) => {
  return api.delete(`/vendors/${id}`);
};

export const getVendorMenu = (vendorId) => {
  return api.get(`/vendors/${vendorId}/menu`);
};

export const addMenuItem = (vendorId, data) => {
  return api.post(`/vendors/${vendorId}/menu`, data);
};

export const updateMenuItem = (vendorId, itemId, data) => {
  return api.put(`/vendors/${vendorId}/menu/${itemId}`, data);
};

export const deleteMenuItem = (vendorId, itemId) => {
  return api.delete(`/vendors/${vendorId}/menu/${itemId}`);
};

export const updateVendorStatus = (id, status) => {
  return api.patch(`/vendors/${id}/status`, { status });
};

export const getVendorCategories = () => {
  return api.get('/vendors/categories');
};

export const searchVendors = (query) => {
  return api.get('/vendors/search', { params: { q: query } });
};

export const getVendorReviews = (vendorId, params) => {
  return api.get(`/vendors/${vendorId}/reviews`, { params });
};

export const addVendorReview = (vendorId, data) => {
  return api.post(`/vendors/${vendorId}/reviews`, data);
};
