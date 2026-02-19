const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh-token",
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

export default API_PATHS;
