import axios from 'axios';

// Base URL of your backend
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040';

// Create an axios instance (optional but useful)
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;


