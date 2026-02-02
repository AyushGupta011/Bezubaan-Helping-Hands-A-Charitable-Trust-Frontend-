
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040';

const api = axios.create({
  baseURL: API_URL,
   withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const login = (email, password) => 
  api.post('/admin/login', { email, password });

export const verifyToken = () => 
  api.get('/admin/verify');

export const logout = () => 
  api.post('/admin/logout');

export const getDashboardStats = () => 
  api.get('/admin/dashboard/stats');

export const getContacts = (page = 1) => 
  api.get(`/admin/contacts?page=${page}`);

export const getVolunteers = (page = 1) => 
  api.get(`/admin/volunteers?page=${page}`);

export const getReports = (page = 1) => 
  api.get(`/admin/reports?page=${page}`);

export const getDonations = (page = 1) => 
  api.get(`/admin/donations?page=${page}`);

export const updateReportStatus = (id, status) => 
  api.put(`/admin/reports/${id}/status`, { status });

export const deleteContact = (id) => 
  api.delete(`/admin/contacts/${id}`);

export default api;