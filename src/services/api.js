import axios from 'axios';
import { toast } from 'react-toastify';

// Production: set VITE_API_URL at build time (e.g. https://api.example.com/api).
// Local dev: leave unset to use /api with Vite proxy (vite.config.js -> localhost:8082).
const apiBase = import.meta.env.VITE_API_URL?.trim() || '/api';

const api = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and AI Core signals
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || '';

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // AI Core Toxicity Intercept
    if (message.toLowerCase().includes('toxic') || message.toLowerCase().includes('rejected')) {
      toast.error('Content blocked: moderation filter flagged this text.', {
        position: 'top-center',
        autoClose: 5000,
        theme: 'dark',
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;