import axios from 'axios';

// API Base URL - Configure for your environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Token Interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ==========================================
// ACCOUNT ENDPOINTS
// ==========================================
export const accountAPI = {
  getAccounts: () => api.get('/accounts/'),
  getAccount: (accountId) => api.get(`/accounts/${accountId}`),
  getBalance: (accountId) => api.get(`/accounts/${accountId}/balance`),
  createAccount: (data) => api.post('/accounts/', data),
};

// ==========================================
// TRANSACTION ENDPOINTS
// ==========================================
export const transactionAPI = {
  transfer: (data) => api.post('/transactions/transfer', data),
  getTransactionHistory: (accountId, limit = 50, offset = 0) =>
    api.get(`/transactions/${accountId}?limit=${limit}&offset=${offset}`),
  getTransaction: (transactionId) => api.get(`/transactions/${transactionId}`),
};

// ==========================================
// LOAN ENDPOINTS
// ==========================================
export const loanAPI = {
  applyForLoan: (data) => api.post('/loans/apply', data),
  getMyLoans: () => api.get('/loans/my-loans'),
  getLoan: (loanId) => api.get(`/loans/${loanId}`),
  approveLoan: (loanId, data) => api.post(`/loans/${loanId}/approve`, data),
  rejectLoan: (loanId, data) => api.post(`/loans/${loanId}/reject`, data),
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getFraudAlerts: () => api.get('/admin/fraud-alerts'),
  reviewFraudAlert: (alertId, data) => api.post(`/admin/fraud-alerts/${alertId}/review`, data),
  freezeAccount: (accountId) => api.post(`/admin/accounts/${accountId}/freeze`),
  deactivateUser: (userId) => api.post(`/admin/user/${userId}/deactivate`),
  getDashboard: () => api.get('/admin/dashboard'),
};

// ==========================================
// HEALTH CHECK
// ==========================================
export const healthCheck = () => api.get('/health');

export default api;
