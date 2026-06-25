import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  registerCustomer: (data) => api.post('/auth/register-customer', data),
  loginCustomer: (data) => api.post('/auth/login-customer', data),
  deleteAccount: (password) =>
    api.delete('/auth/delete-account', { data: { password } }),
};

// Services endpoints
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/services/categories'),
  create: (data, key) => api.post('/services', data, { headers: { 'x-admin-key': key } }),
};

// Bookings endpoints
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  rateBooking: (bookingId, data) => api.post(`/bookings/${bookingId}/rate`, data),
};

// Payments endpoints
export const paymentsAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getHistory: () => api.get('/payments/history'),
};

// Professionals endpoints
export const professionalsAPI = {
  apply: (data) => api.post('/professionals/apply', data),
  getApplications: (key) =>
    api.get('/professionals/applications', { headers: { 'x-admin-key': key } }),
  updateStatus: (id, status, notes, key) =>
    api.patch(
      `/professionals/applications/${id}`,
      { status, notes },
      { headers: { 'x-admin-key': key } }
    ),
};

// Admin Dashboard endpoints
export const adminAPI = {
  getStats: (key) => api.get('/admin/stats', { headers: { 'x-admin-key': key } }),
  getCustomers: (key) => api.get('/admin/customers', { headers: { 'x-admin-key': key } }),
  toggleCustomer: (id, isActive, key) =>
    api.patch(`/admin/customers/${id}/toggle`, { isActive }, { headers: { 'x-admin-key': key } }),
  getBookings: (key) => api.get('/admin/bookings', { headers: { 'x-admin-key': key } }),
  updateBooking: (id, data, key) =>
    api.patch(`/admin/bookings/${id}/status`, data, { headers: { 'x-admin-key': key } }),
  reassignBooking: (id, providerId, key) =>
    api.patch(`/admin/bookings/${id}/reassign`, { providerId }, { headers: { 'x-admin-key': key } }),
  getProviders: (key) => api.get('/admin/providers', { headers: { 'x-admin-key': key } }),
  verifyProvider: (id, status, key) =>
    api.patch(`/admin/providers/${id}/verify`, { status }, { headers: { 'x-admin-key': key } }),
  getServices: (key) => api.get('/admin/services', { headers: { 'x-admin-key': key } }),
  toggleService: (id, isActive, key) =>
    api.patch(`/admin/services/${id}/toggle`, { isActive }, { headers: { 'x-admin-key': key } }),
  updateService: (id, data, key) =>
    api.put(`/admin/services/${id}`, data, { headers: { 'x-admin-key': key } }),
  deleteService: (id, key) =>
    api.delete(`/admin/services/${id}`, { headers: { 'x-admin-key': key } }),
};

export default api;
