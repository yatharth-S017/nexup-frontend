import axios from 'axios';
import { getAuthToken, clearAuthToken } from '../utils/token.js';
import { API_BASE_URL } from '../constants/api.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally (401, 403, Network Errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      // Handle unauthorized / forbidden states
      if (status === 401 || status === 403) {
        clearAuthToken();
        // Dispatch global logout event to let AuthContext know
        window.dispatchEvent(new Event('auth-logout'));
      }
    } else if (error.request) {
      // Network Error (no response received)
      console.error('Network Error: Cannot connect to the server.');
    }
    return Promise.reject(error);
  }
);

export default api;
