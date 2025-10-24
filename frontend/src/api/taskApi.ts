// frontend/src/api/taskApi.ts
import api from "./api";
import type { Task } from "../types/Task";

// Normaliza a resposta (array ou Page<{content: Task[]}>)
function normalizeTasks(data: any): Task[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}

// GET /api/tasks ou /api/tasks/search
export async function getAllTasks(queryString?: string) {
  const url = queryString ? `/tasks/search?${queryString}` : "/tasks";
  const res = await api.get(url);
  const normalized = normalizeTasks(res.data);
  // devolvemos no formato do axios, mas com data = array normalizado
  return { ...res, data: normalized as Task[] };
}

// POST /api/tasks
export function createTask(task: Partial<Task>) {
  return api.post("/tasks", task);
}
