import api from './axios';

export const projectApi = {
  getProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },
  createProject: async (data) => {
    const response = await api.post('/api/projects', data);
    return response.data;
  },
  getProjectById: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}`);
    return response.data;
  },
  updateProject: async (projectId, data) => {
    const response = await api.put(`/api/projects/${projectId}`, data);
    return response.data;
  },
  deleteProject: async (projectId) => {
    const response = await api.delete(`/api/projects/${projectId}`);
    return response.data;
  },
  addMember: async (projectId, memberData) => {
    const response = await api.post(`/api/projects/${projectId}/members`, memberData);
    return response.data;
  },
  getProjectMembers: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/members`);
    return response.data;
  },
  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/api/projects/${projectId}/members/${userId}`);
    return response.data;
  },
  changeMemberRole: async (projectId, userId, role) => {
    const response = await api.patch(`/api/projects/${projectId}/members/${userId}/role`, { role });
    return response.data;
  },
};
