import api from "./api";

export const getTasks = (token: string) =>
  api.get("/getTask", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTask = (token: string, title: string) =>
  api.post(
    "/createTask",
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
export const updateTask = (token: string, id: string, title: string) =>
  api.patch(
    `/${id}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deleteTask = (token: string, id: string) =>
  api.delete(`/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const toggleTask = (token: string, id: string) =>
  api.patch(`/${id}/toggle`, {
    headers: { Authorization: `Bearer ${token}` },
  });  