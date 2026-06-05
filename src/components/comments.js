/* Componente que gestiona la sección de comentarios de una tarea.
   Permite cargar y renderizar comentarios existentes y agregar nuevos. */

import { getComments, addComment } from "../services/commentService.js";
import { escapeHtml } from "../utils/dom.js";
import { showToast } from "../utils/toast.js";

/* Carga los comentarios de una tarea desde el backend y los renderiza en el DOM.
   @param {string} taskId - ID de la tarea.
   @returns {Promise<void>} */
export const loadComments = async (taskId) => {
  const container = document.getElementById("comments-list");
  if (!container) return;
  try {
    /* Obtiene los comentarios; si no hay, muestra mensaje vacío. */
    const comments = await getComments(taskId);
    if (comments.length === 0) {
      container.innerHTML = '<p class="text-sm text-slate-500">No hay comentarios todav&iacute;a.</p>';
    } else {
      container.innerHTML = comments.map((c) => {
        /* Formatea la fecha del comentario en locale colombiano. */
        const date = new Date(c.createdAt).toLocaleString("es-CO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
        return `
          <div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-bold text-slate-900">${escapeHtml(c.author)}</p>
              <span class="text-xs text-slate-400">${date}</span>
            </div>
            <p class="mt-1 text-sm text-slate-600">${escapeHtml(c.content)}</p>
          </div>
        `;
      }).join("");
    }
  } catch (error) {
    container.innerHTML = '<p class="text-sm text-rose-500">Error al cargar los comentarios.</p>';
  }
};

/* Inicializa el formulario de comentarios: captura el evento submit, valida y envía.
   @param {string} taskId - ID de la tarea a la que pertenece el comentario.
   @returns {void} */
export const initCommentForm = (taskId) => {
  const form = document.getElementById("comment-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("comment-input");
    if (!input) return;
    /* Obtiene el contenido del comentario y valida que no esté vacío. */
    const content = input.value.trim();
    if (!content) return;
    input.disabled = true;
    try {
      await addComment(taskId, content);
      input.value = "";
      showToast("Comentario agregado", "success");
      await loadComments(taskId);
    } catch (error) {
      showToast(error.message || "Error al agregar comentario", "error");
    }
    input.disabled = false;
    input.focus();
  });
};
