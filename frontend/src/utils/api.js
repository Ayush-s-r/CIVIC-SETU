const API_BASE_URL = "http://localhost:8080/api";

// ================= TOKEN =================
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// ================= REQUEST HANDLER =================
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log("📡 API CALL:", `${API_BASE_URL}${url}`);

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // ✅ Safe JSON parsing
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      console.error("❌ API ERROR RESPONSE:", data);
      throw new Error(data.message || `Error ${response.status}`);
    }

    console.log("✅ API RESPONSE:", data);
    return data;

  } catch (error) {
    console.error("🚨 API FAILED:", error.message);
    throw error;
  }
};

// ================= AUTH =================
export const authAPI = {
  login: async (email, password) => {
    const data = await makeRequest("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // 🔥 Store token automatically
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    return data;
  },

  register: async (name, email, password) => {
    return makeRequest("/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  getProfile: async () => {
    return makeRequest("/users/profile");
  },
};

// ================= COMPLAINTS =================
export const complaintsAPI = {
  create: async (complaintData) => {
    return makeRequest("/complaints", {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
  },

  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/complaints?${queryString}`);
  },

  getById: async (id) => {
    return makeRequest(`/complaints/${id}`);
  },

  update: async (id, updateData) => {
    return makeRequest(`/complaints/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  },

  delete: async (id) => {
    return makeRequest(`/complaints/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    return makeRequest("/complaints/stats/overview");
  },
};

// ================= ADMIN =================
export const adminAPI = {
  getDashboard: async () => {
    return makeRequest("/admin/dashboard");
  },

  getAnalytics: async (period = "6months") => {
    return makeRequest(`/admin/analytics?period=${period}`);
  },

  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/admin/users?${queryString}`);
  },

  updateUser: async (id, userData) => {
    return makeRequest(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return makeRequest(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  getDepartments: async () => {
    return makeRequest("/admin/departments");
  },
};

// ================= CITIZEN =================
export const citizenAPI = {
  getDashboard: async () => {
    return makeRequest("/citizen/dashboard");
  },

  getComplaints: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return makeRequest(`/citizen/complaints?${queryString}`);
  },

  getComplaintById: async (id) => {
    return makeRequest(`/citizen/complaints/${id}`);
  },

  createComplaint: async (complaintData) => {
    return makeRequest("/citizen/complaints", {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
  },

  getProfile: async () => {
    return makeRequest("/citizen/profile");
  },

  updateProfile: async (profileData) => {
    return makeRequest("/citizen/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  getStats: async () => {
    return makeRequest("/citizen/stats");
  },
};

// ================= UTILS =================
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export default {
  authAPI,
  complaintsAPI,
  adminAPI,
  citizenAPI,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
};