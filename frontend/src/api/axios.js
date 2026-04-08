import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📡 API CALL:", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (Handle Errors)
api.interceptors.response.use(
  (response) => {
    console.log("✅ API RESPONSE:", response.data);
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    console.error("🚨 API FAILED:", message);
    return Promise.reject(new Error(message));
  }
);

export default api;