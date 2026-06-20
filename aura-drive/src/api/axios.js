import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If sending FormData, let axios handle Content-Type automatically
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  } else {
    // Remove Content-Type for FormData to let axios set boundary
    delete config.headers['Content-Type'];
  }
  
  return config;
});

export default api;
