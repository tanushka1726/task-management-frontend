import api from "./api";

export const loginUser = (data: any) =>
  api.post("/auth/login", data);

export const registerUser = (data: any) =>
  api.post("/auth/register", data);

export const logoutUser = (data: any) =>
  api.post("/auth/logout", data);
