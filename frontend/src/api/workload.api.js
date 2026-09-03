import api from './axios';

export const workloadApi = {
  getProjectWorkload: async (projectId) => {
    const response = await api.get(`/workload/project/${projectId}`);
    return response.data;
  },
  getMemberWorkload: async (userId) => {
    const response = await api.get(`/workload/member/${userId}`);
    return response.data;
  },
  getOverloadedMembers: async () => {
    const response = await api.get('/workload/overloaded');
    return response.data;
  },
  getMemberCapacity: async (userId) => {
    const response = await api.get(`/capacity/${userId}`);
    return response.data;
  },
  getDeadlinePrediction: async (taskId) => {
    const response = await api.get(`/deadline/${taskId}`);
    return response.data;
  },
};
