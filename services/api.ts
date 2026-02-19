import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Ensure backend is running here
  headers: {
    "Content-Type": "application/json", // ✅ Add default headers
  },
  withCredentials: true, // ✅ If your backend uses cookies/sessions
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      const response = await axios.post("http://localhost:5000/auth/refresh", {
        refreshToken,
      });

      localStorage.setItem("token", response.data.accessToken);

      return api(originalRequest);
    }

    return Promise.reject(err);
  }
);


export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    CHECK_LOGIN: "/auth/check-login",
  },
  TASKS: {
    BASE: "/tasks",
    TOGGLE: (id: number) => `/tasks/${id}/toggle`,
  },
};

export default api;

