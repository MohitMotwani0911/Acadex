import api from "./api";

const noteService = {
  // Upload a new PDF note
  uploadNote: async (data) => {
    const response = await api.post(
      "/notes",
      data
    );

    return response.data;
  },

  // Get all notes
  getNotes: async () => {
    const response = await api.get(
      "/notes"
    );

    return response.data;
  },

  // Get notes for a particular subject
  getSubjectNotes: async (subjectId) => {
    const response = await api.get(
      `/notes/subject/${subjectId}`
    );

    return response.data;
  },

  // Get a single note
  getNote: async (id) => {
    const response = await api.get(
      `/notes/${id}`
    );

    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(
      `/notes/${id}`
    );

    return response.data;
  },
};

export default noteService;