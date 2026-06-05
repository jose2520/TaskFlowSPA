/* Servicio commentService.js
   Responsabilidad: Gestiona los comentarios asociados a las tareas.
   Permite obtener comentarios de una tarea (ordenados por fecha)
   y agregar nuevos comentarios con autoría. */

// Importa el cliente HTTP para peticiones al backend fake
import { api } from "./api.js";
// Importa utilidad para obtener el usuario actual
import { getCurrentUser } from "./authService.js";

/* Obtiene los comentarios de una tarea, ordenados por fecha ascendente.
   @param {string} taskId - ID de la tarea
   @returns {Promise<Array>} - Lista de comentarios */
export const getComments = (taskId) => api.get(`/comments?taskId=${taskId}&_sort=createdAt&_order=asc`);

/* Agrega un comentario a una tarea.
   @param {string} taskId - ID de la tarea
   @param {string} content - Contenido del comentario
   @returns {Promise<Object>} - Comentario creado */
export const addComment = (taskId, content) => {
  const user = getCurrentUser();
  return api.post("/comments", {
    id: Date.now().toString(),
    taskId,
    author: user?.name || "Anónimo",
    authorId: user?.id || null,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  });
};
