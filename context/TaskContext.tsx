"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../services/task.services";
import { AuthContext } from "./AuthContext";

export interface Task {
  id: number;
  title: string;
  description: string;
  iscompleted: boolean;
  completed: boolean;
  userId: number;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string) => Promise<void>;
  editTask: (id: number, title?: string, description?: string) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  toggleTaskStatus: (id: number) => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

const toTask = (item: any): Task => ({
  id: Number(item.id),
  title: String(item.title ?? ""),
  description: String(item.description ?? ""),
  iscompleted: Boolean(item.iscompleted),
  completed: Boolean(item.iscompleted),
  userId: Number(item.userId ?? 0),
  createdAt: String(item.createdAt ?? ""),
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);
  const token = auth?.token ?? null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getTasks(token);
      const apiData = response.data?.data;
      const list = Array.isArray(apiData) ? apiData.map(toTask) : [];
      setTasks(list);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addTask = useCallback(
    async (title: string, description: string) => {
      if (!token) {
        setError("You are not logged in");
        return;
      }

      setError(null);
      await createTask(token, title, description);
      await fetchTasks();
    },
    [fetchTasks, token]
  );

  const editTask = useCallback(
    async (id: number, title?: string, description?: string) => {
      if (!token) {
        setError("You are not logged in");
        return;
      }

      setError(null);
      await updateTask(token, String(id), title, description);
      await fetchTasks();
    },
    [fetchTasks, token]
  );

  const removeTask = useCallback(
    async (id: number) => {
      if (!token) {
        setError("You are not logged in");
        return;
      }

      setError(null);
      await deleteTask(token, String(id));
      await fetchTasks();
    },
    [fetchTasks, token]
  );

  const toggleTaskStatus = useCallback(
    async (id: number) => {
      if (!token) {
        setError("You are not logged in");
        return;
      }

      setError(null);
      await toggleTask(token, String(id));
      await fetchTasks();
    },
    [fetchTasks, token]
  );

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      fetchTasks,
      addTask,
      editTask,
      removeTask,
      toggleTaskStatus,
    }),
    [tasks, loading, error, fetchTasks, addTask, editTask, removeTask, toggleTaskStatus]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
