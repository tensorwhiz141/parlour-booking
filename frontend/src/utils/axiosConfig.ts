// import axios from 'axios';

// // Base URL for API
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// // const API_URL = import.meta.env.VITE_API_URL ;

// // Create axios instance with base URL
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor for authentication
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const originalRequest = error.config;
    
//     // Handle token expiration
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

// Base URL for API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Skip redirect for /auth/login to allow LoginPage to handle 401 errors
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }
    
    // Handle token expiration for other routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;