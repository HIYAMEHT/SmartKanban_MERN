import api from './axios';

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.patch('/api/users/profile', data);
    return response.data;
  },
  getSkills: async () => {
    const response = await api.get('/api/users/skills');
    return response.data;
  },
  updateSkills: async (skills) => {
    const response = await api.put('/api/users/skills', { skills });
    return response.data;
  },
  getAvailability: async () => {
    const response = await api.get('/api/users/availability');
    return response.data;
  },
  updateAvailability: async (data) => {
    const response = await api.put('/api/users/availability', data);
    return response.data;
  },
  getUserIntelligence: async (userId) => {
    const response = await api.get(`/api/users/${userId}/intelligence`);
    return response.data;
  },
};
