// frontend/src/api/taskApi.ts
import api from "./api";
import type { Task } from "../types/Task";

// GET /api/tasks ou /api/tasks/search
export function getAllTasks(queryString?: string) {
  const url = queryString ? `/tasks/search?${queryString}` : "/tasks";
  return api.get<Task[]>(url);
}

// POST /api/tasks
export function createTask(task: Partial<Task>) {
  return api.post("/tasks", task);
}
