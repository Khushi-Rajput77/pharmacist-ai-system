import axios from 'axios';

// ✅ API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('📡 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor
 * Adds JWT token to all requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles token expiration and unauthorized access
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('authToken');
      localStorage.removeItem('customerId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ========== AUTHENTICATION API ==========
export const authAPI = {
  login: (email, password) => api.post('/api/customers/login', { email, password }),
  register: (data) => api.post('/api/customers/register', data),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('customerId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  }
};

// ========== MEDICINES API ==========
export const medicineAPI = {
  getAll: () => api.get('/api/medicines'),
  getById: (id) => api.get(`/api/medicines/${id}`),
  search: (name) => api.get(`/api/medicines/search/${name}`),
  create: (data) => api.post('/api/medicines', data),
  update: (id, data) => api.patch(`/api/medicines/${id}`, data),
  delete: (id) => api.delete(`/api/medicines/${id}`)
};

// ========== CUSTOMERS API ==========
export const customerAPI = {
  getAll: () => api.get('/api/customers'),
  getById: (id) => api.get(`/api/customers/${id}`),
  register: (data) => api.post('/api/customers/register', data),
  update: (id, data) => api.patch(`/api/customers/${id}`, data),
  delete: (id) => api.delete(`/api/customers/${id}`)
};

// ========== ORDERS API ==========
export const orderAPI = {
  getAll: () => api.get('/api/orders'),
  getByCustomer: (customerId) => api.get(`/api/orders/customer/${customerId}`),
  create: (data) => api.post('/api/orders', data),
  update: (orderId, data) => api.patch(`/api/orders/${orderId}`, data)
};

// ========== CHAT API ==========
export const chatAPI = {
  process: (message, customerId) => api.post('/api/chat/process', { message, customerId })
};

// ========== REFILLS API ==========
export const refillAPI = {
  getAlerts: () => api.get('/api/refills/alerts'),
  getCustomerAlerts: (customerId) => api.get(`/api/refills/customer/${customerId}`),
  markSent: (alertId) => api.patch(`/api/refills/${alertId}/sent`),
  markOrdered: (alertId) => api.patch(`/api/refills/${alertId}/ordered`)
};

export default api;