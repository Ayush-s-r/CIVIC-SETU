import api from "./axios";
import { setAuthToken } from "../utils/token";

export const authAPI = {
  login: async (email, password) => {
   
    const data = await api.post("/users/login", { email, password });
     console.log(data)

    if (data.token) {
      setAuthToken(data.token);
    }

    return data;
  },

  register: (name, email, password) =>
    api.post("/users/register", { name, email, password }),

  getProfile: () => api.get("/users/profile"),
};