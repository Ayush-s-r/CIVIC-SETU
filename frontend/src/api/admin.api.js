import api from "./axios";

export const adminAPI = {
  getDashboard: () =>
    api.get("/admin/dashboard"),

  getAnalytics: (period = "6months") =>
    api.get("/admin/analytics", { params: { period } }),

  getUsers: (params = {}) =>
    api.get("/admin/users", { params }),

  updateUser: (id, userData) =>
    api.put(`/admin/users/${id}`, userData),

  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),

  getDepartments: () =>
    api.get("/admin/departments"),
};