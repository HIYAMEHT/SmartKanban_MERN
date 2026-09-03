import api from './axios';

export const boardApi = {
  getBoards: async () => {
    const response = await api.get('/api/boards');
    return response.data;
  },
  createBoard: async (data) => {
    const response = await api.post('/api/boards', data);
    return response.data;
  },
  getBoard: async (boardId) => {
    const response = await api.get(`/api/boards/${boardId}`);
    return response.data;
  },
  updateBoard: async (boardId, data) => {
    const response = await api.patch(`/api/boards/${boardId}`, data);
    return response.data;
  },
  deleteBoard: async (boardId) => {
    const response = await api.delete(`/api/boards/${boardId}`);
    return response.data;
  },
  getTasks: async (boardId) => {
    const response = await api.get(`/api/boards/${boardId}/tasks`);
    return response.data;
  },
  createTask: async (boardId, data) => {
    const response = await api.post(`/api/boards/${boardId}/tasks`, data);
    return response.data;
  },
  updateTask: async (taskId, data) => {
    const response = await api.patch(`/api/boards/tasks/${taskId}`, data);
    return response.data;
  },
  deleteTask: async (taskId) => {
    const response = await api.delete(`/api/boards/tasks/${taskId}`);
    return response.data;
  },
};
