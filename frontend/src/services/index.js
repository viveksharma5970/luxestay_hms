import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const roomService = {
  getAvailable: () => api.get('/rooms/available'),
  getAll: () => api.get('/rooms'),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getAll: () => api.get('/bookings'),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const serviceService = {
  getAll: () => api.get('/services'),
  create: (data) => api.post('/services/manage', data),
  delete: (id) => api.delete(`/services/manage/${id}`),
  request: (data) => api.post('/services/request', data),
  getByBooking: (bookingId) => api.get(`/services/booking/${bookingId}`),
};

export const billingService = {
  generate: (bookingId) => api.post(`/billing/generate/${bookingId}`),
  getByBooking: (bookingId) => api.get(`/billing/booking/${bookingId}`),
  pay: (billingId) => api.put(`/billing/${billingId}/pay`),
};


export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
};
