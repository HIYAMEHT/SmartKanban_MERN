import api from "./axios";

export const timeTrackingApi = {

  // ==========================================
  // START TIMER
  // ==========================================

  startTimer: async (taskId) => {

    const response =
      await api.post(
        "/api/time-tracking/start",
        {
          taskId,
        }
      );

    return response.data;
  },


  // ==========================================
  // STOP TIMER
  // ==========================================

  stopTimer: async () => {

    const response =
      await api.post(
        "/api/time-tracking/stop"
      );

    return response.data;
  },


  // ==========================================
  // GET ACTIVE TIMER
  // ==========================================

  getActiveTimer: async () => {

    const response =
      await api.get(
        "/api/time-tracking/active"
      );

    return response.data;
  },

};