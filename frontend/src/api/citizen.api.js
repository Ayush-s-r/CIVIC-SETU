import api from "./axios";

export const citizenAPI = {
  getDashboard: () =>
    api.get("/citizen/dashboard"),

  getComplaints: (params = {}) =>
    api.get("/citizen/complaints", { params }),

  getComplaintById: (id) =>
    api.get(`/citizen/complaints/${id}`),

  createComplaint: (data) =>
    api.post("/citizen/complaints", data),

  getProfile: () =>
    api.get("/citizen/profile"),

  updateProfile: (data) =>
    api.put("/citizen/profile", data),

  getStats: () =>
    api.get("/citizen/stats"),
};