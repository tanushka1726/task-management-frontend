"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getTasks, createTask } from "@/services/task.services";

export default function Home() {
    
const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    if (!token) return;
    const res = await getTasks(token);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!token) return;
    await createTask(token, title);
    setTitle("");
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  return (
    <div>
      <h1>Tasks</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button onClick={addTask}>Add</button>

      {tasks.map(t => (
        <p key={t.id}>{t.title}</p>
      ))}
    </div>
  );
}
