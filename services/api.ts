import axios from "axios";
import { getToken, setToken, getRefreshToken, setRefreshToken } from "../utils/token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // Add default headers
  },
  withCredentials: true, // If your backend uses cookies/sessions
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        if (response.data?.accessToken) {
          const days = response.data?.accessTokenExpiresIn || 7;
          setToken(response.data.accessToken, days);
        }
        if (response.data?.refreshToken) {
          const days = response.data?.refreshTokenExpiresIn || 30;
          setRefreshToken(response.data.refreshToken, days);
        }

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    CHECK_LOGIN: "/auth/check-login",
  },
  TASKS: {
    BASE: "/tasks",
    GET: "/tasks/getTask",
    CREATE: "/tasks/create",
    UPDATE: (id: number) => `/tasks/update/${id}`,
    DELETE: (id: number) => `/tasks/delete/${id}`,
    TOGGLE: (id: number) => `/tasks/toggle/${id}`,
  },
};

export default api;
