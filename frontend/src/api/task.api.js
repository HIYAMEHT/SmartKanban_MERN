import api from "./axios";

export const taskApi = {
  // CREATE TASK
  createTask: async (data) => {
    const response = await api.post("/api/tasks", data);
    return response.data;
  },

  // GET ALL TASKS OF A PROJECT
  getProjectTasks: async (projectId) => {
    const response = await api.get(`/api/tasks/project/${projectId}`);
    return response.data;
  },

  // GET SINGLE TASK
  getSingleTask: async (taskId) => {
    const response = await api.get(`/api/tasks/${taskId}`);
    return response.data;
  },

  // UPDATE TASK
  updateTask: async (taskId, data) => {
    const response = await api.patch(`/api/tasks/${taskId}`, data);
    return response.data;
  },

  // UPDATE STATUS
  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(
      `/api/tasks/${taskId}/status`,
      { status }
    );

    return response.data;
  },

  // ASSIGN TASK
  assignTask: async (taskId, assignee) => {
    const response = await api.patch(
      `/api/tasks/${taskId}/assign`,
      { assignee }
    );

    return response.data;
  },

  // DELETE TASK
  deleteTask: async (taskId) => {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response.data;
  },
};