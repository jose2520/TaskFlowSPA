import { api } from "./api.js";

export const getTasks = ({ userId = null, includeAll = false } = {}) => {
  const params = [];
  if (!includeAll && userId) {
    params.push(`ownerId=${encodeURIComponent(userId)}`);
  }
  const qs = params.length > 0 ? `?${params.join("&")}` : "";
  return api.get(`/tasks${qs}`);
};

export const getTaskById = (taskId) => api.get(`/tasks/${taskId}`);

export const createTask = ({ ownerId, title, description, status, dueDate }) => {
  const newTask = {
    id: Date.now().toString(),
    ownerId,
    title: title.trim(),
    description: description.trim(),
    status,
    dueDate: dueDate || "",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  return api.post("/tasks", newTask);
};

export const updateTask = (taskId, updated) => {
  return api.patch(`/tasks/${taskId}`, {
    title: updated.title.trim(),
    description: updated.description.trim(),
    status: updated.status,
    dueDate: updated.dueDate || "",
  });
};

export const deleteTask = (taskId) => {
  return api.delete(`/tasks/${taskId}`);
};

export const deleteTasksForUser = async (userId) => {
  const tasks = await api.get(`/tasks?ownerId=${userId}`);
  await Promise.all(tasks.map((task) => api.delete(`/tasks/${task.id}`)));
};

export const getTaskCounts = async ({ userId = null, includeAll = false } = {}) => {
  const tasks = await getTasks({ userId, includeAll });
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };
};
