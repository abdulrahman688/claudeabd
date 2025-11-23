import axios from 'axios';
import { store } from '../store/store';
import { logout } from '@features/auth/store/authSlice';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      toast.error('جلستك انتهت. يرجى تسجيل الدخول');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string, config?) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, data?, config?) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),
  put: <T>(url: string, data?, config?) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),
  delete: <T>(url: string, config?) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};
