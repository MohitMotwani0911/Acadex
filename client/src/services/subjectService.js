import api from "./api";

const subjectService = {
  getSubjects: async () => {
    const response = await api.get("/subjects");
    return response.data;
  },

  getSubject: async (id) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  createSubject: async (subjectData) => {
    const response = await api.post("/subjects", subjectData);
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};

export default subjectService;