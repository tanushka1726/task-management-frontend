const API_PATHS = {
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

export default API_PATHS;
