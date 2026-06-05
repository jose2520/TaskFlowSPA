/* Servicio taskService.js
   Responsabilidad: Gestiona el CRUD de tareas (crear, leer, actualizar, eliminar)
   y proporciona consultas filtradas por usuario, conteos por estado
   y eliminación masiva de tareas de un usuario. */

// Importa el cliente HTTP para peticiones al backend fake
import { api } from "./api.js";
// Importa el servicio de registro de actividad
import { addLog } from "./logService.js";
// Importa utilidad para obtener el usuario actual y verificar admin desde authService
import { getCurrentUser, isAdmin } from "./authService.js";

/* Obtiene lista de tareas, opcionalmente filtradas por usuario.
   @param {Object} opciones - { userId?: string, includeAll?: boolean }
   @returns {Promise<Array>} - Lista de tareas */
export const getTasks = ({ userId = null, includeAll = false } = {}) => {
  const params = [];
  if (!includeAll && userId) {
    params.push(`ownerId=${encodeURIComponent(userId)}`);
  }
  const qs = params.length > 0 ? `?${params.join("&")}` : "";
  return api.get(`/tasks${qs}`);
};

/* Obtiene una tarea por su ID.
   @param {string} taskId - ID de la tarea
   @returns {Promise<Object>} - Datos de la tarea */
export const getTaskById = (taskId) => api.get(`/tasks/${taskId}`);

/* Crea una nueva tarea.
   @param {Object} datos - { ownerId, title, description, status, dueDate }
   @returns {Promise<Object>} - Tarea creada */
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
  addLog("Tarea creada", `${title} por ${getCurrentUser()?.name || "desconocido"}`);
  return api.post("/tasks", newTask);
};

/* Actualiza una tarea existente.
   @param {string} taskId - ID de la tarea a actualizar
   @param {Object} updated - Datos actualizados (title, description, status, dueDate)
   @returns {Promise<Object>} - Tarea actualizada */
export const updateTask = async (taskId, updated) => {
  const task = await api.get(`/tasks/${taskId}`);
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("No autenticado");
  if (task.ownerId !== currentUser.id && !isAdmin()) {
    throw new Error("No tienes permiso para actualizar esta tarea");
  }
  addLog("Tarea actualizada", `${updated.title.trim()} por ${currentUser?.name || "desconocido"}`);
  return api.patch(`/tasks/${taskId}`, {
    title: updated.title.trim(),
    description: updated.description.trim(),
    status: updated.status,
    dueDate: updated.dueDate || "",
  });
};

/* Elimina una tarea por su ID.
   @param {string} taskId - ID de la tarea a eliminar
   @returns {Promise<void>} */
export const deleteTask = async (taskId) => {
  const task = await api.get(`/tasks/${taskId}`).catch(() => null);
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("No autenticado");
  if (task && task.ownerId !== currentUser.id && !isAdmin()) {
    throw new Error("No tienes permiso para eliminar esta tarea");
  }
  addLog("Tarea eliminada", `${task?.title || taskId} por ${currentUser?.name || "desconocido"}`);
  return api.delete(`/tasks/${taskId}`);
};

/* Elimina todas las tareas pertenecientes a un usuario.
   @param {string} userId - ID del usuario propietario
   @returns {Promise<void>} */
export const deleteTasksForUser = async (userId) => {
  const tasks = await api.get(`/tasks?ownerId=${userId}`);
  await Promise.all(tasks.map((task) => api.delete(`/tasks/${task.id}`)));
};

/* Obtiene conteos de tareas agrupadas por estado.
   @param {Object} opciones - { userId?: string, includeAll?: boolean }
   @returns {Promise<Object>} - { total, pending, inProgress, completed } */
export const getTaskCounts = async ({ userId = null, includeAll = false } = {}) => {
  const tasks = await getTasks({ userId, includeAll });
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };
};
