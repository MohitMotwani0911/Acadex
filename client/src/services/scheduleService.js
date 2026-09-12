import api from "./api";

const scheduleService = {
  getSchedules: async () => {
    const response = await api.get("/schedules");
    return response.data;
  },

  getSchedule: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },

  createSchedule: async (scheduleData) => {
    const response = await api.post(
      "/schedules",
      scheduleData
    );
    return response.data;
  },

  updateSchedule: async (id, scheduleData) => {
    const response = await api.put(
      `/schedules/${id}`,
      scheduleData
    );
    return response.data;
  },

  deleteSchedule: async (id) => {
    const response = await api.delete(
      `/schedules/${id}`
    );
    return response.data;
  },
};

export default scheduleService;