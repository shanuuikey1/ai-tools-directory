import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
};

// Services endpoints
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/services/categories'),
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

export default api;
