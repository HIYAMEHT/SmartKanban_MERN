import api from './axios';

export const recommendationApi = {
  getTaskRecommendations: async (taskId) => {
    const response = await api.get(`/recommend/task/${taskId}`);
    return response.data;
  },
  assignTask: async (taskId, userId) => {
    const response = await api.post('/recommend/assign-task', { taskId, userId });
    return response.data;
  },
};
