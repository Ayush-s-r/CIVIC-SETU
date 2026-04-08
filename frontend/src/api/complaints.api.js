import api from "./axios";

export const complaintsAPI = {
  create: (complaintData) =>
    api.post("/complaints", complaintData),

  getAll: (params = {}) =>
    api.get("/complaints", { params }),

  getById: (id) =>
    api.get(`/complaints/${id}`),

  update: (id, updateData) =>
    api.put(`/complaints/${id}`, updateData),

  delete: (id) =>
    api.delete(`/complaints/${id}`),

  getStats: () =>
    api.get("/complaints/stats/overview"),
};