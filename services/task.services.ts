import API_PATHS from "../utils/apiPaths";
import api from "./api";

export const getTasks = (token: string) =>
  api.get(API_PATHS.TASKS.GET, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTask = (
  token: string,
  title: string,
  description?: string
) =>
  api.post(
    API_PATHS.TASKS.CREATE,
    { title, ...(description !== undefined ? { description } : {}) },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const updateTask = (
  token: string,
  id: string,
  title?: string,
  description?: string
) =>
  api.patch(
    API_PATHS.TASKS.UPDATE(Number(id)),
    {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deleteTask = (token: string, id: string) =>
  api.delete(API_PATHS.TASKS.DELETE(Number(id)), {
    headers: { Authorization: `Bearer ${token}` },
  });

export const toggleTask = (token: string, id: string) =>
  api.patch(
    API_PATHS.TASKS.TOGGLE(Number(id)),
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
