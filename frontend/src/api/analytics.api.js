import api from './axios';

export const analyticsApi = {
  getTaskTimeAnalytics: async () => {
    const response = await api.get('/api/analytics/tasks');
    return response.data;
  },
  getUserTimeAnalytics: async () => {
    const response = await api.get('/api/analytics/users');
    return response.data;
  },
  getProjectTimeAnalytics: async () => {
    const response = await api.get('/api/analytics/projects');
    return response.data;
  },
  getBottleneckAnalytics: async () => {
    const response = await api.get('/api/analytics/bottlenecks');
    return response.data;
  },
};
