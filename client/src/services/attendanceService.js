import api from "./api";

const attendanceService = {
  markAttendance: async (data) => {
    const response = await api.post(
      "/attendance",
      data
    );

    return response.data;
  },

  getSubjectAttendance: async (subjectId) => {
    const response = await api.get(
      `/attendance/subject/${subjectId}`
    );

    return response.data;
  },

  getAttendanceSummary: async () => {
    const response = await api.get(
      "/attendance/summary"
    );

    return response.data;
  },

  getAttendance: async (id) => {
    const response = await api.get(
      `/attendance/${id}`
    );

    return response.data;
  },

  deleteAttendance: async (id) => {
    const response = await api.delete(
      `/attendance/${id}`
    );

    return response.data;
  },
};

export default attendanceService;