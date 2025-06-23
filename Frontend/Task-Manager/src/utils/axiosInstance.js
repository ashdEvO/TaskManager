import axios from 'axios';
import { API_BASE } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // if your backend uses cookies for auth
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
