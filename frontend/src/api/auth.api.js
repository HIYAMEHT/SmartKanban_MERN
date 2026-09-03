import api from './axios';

export const authApi = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  getSession: async () => {
    const response = await api.get('/api/auth/session');
    return response.data;
  },
  refresh: async () => {
    const response = await api.post('/api/auth/refresh');
    return response.data;
  },
};
