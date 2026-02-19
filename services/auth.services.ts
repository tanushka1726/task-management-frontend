import API_PATHS from "../utils/apiPaths";
import api from "./api";
import { clearToken, setRefreshToken, setToken } from "../utils/token";

export const loginUser = async (data: any) => {
  const response = await api.post(API_PATHS.AUTH.LOGIN, data, {
    withCredentials: true,
  });

  const payload = response.data?.data;

  if (payload?.accessToken) {
    setToken(payload.accessToken);
  }

  if (payload?.refreshToken) {
    setRefreshToken(payload.refreshToken);
  }

  return response;
};

export const registerUser = async (data: any) => {
  const response = await api.post(API_PATHS.AUTH.REGISTER, data, {
    withCredentials: true,
  });

  const payload = response.data?.data;

  if (payload?.accessToken) {
    setToken(payload.accessToken);
  }

  if (payload?.refreshToken) {
    setRefreshToken(payload.refreshToken);
  }

  return response;
};

export const logoutUser = async () => {
  const response = await api.post(API_PATHS.AUTH.LOGOUT, {}, { withCredentials: true });
  clearToken();
  return response;
};
