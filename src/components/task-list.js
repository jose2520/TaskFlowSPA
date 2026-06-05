/* Componente que renderiza la lista de tareas con paginación, filtros y ordenamiento.
   Incluye la tarjeta individual de tarea y la lógica de UI asociada. */

import { getTasks, deleteTask } from "../services/taskService.js";
import { getCurrentUser, isAdmin, getAllUsers } from "../services/authService.js";
import { escapeHtml, goTo } from "../utils/dom.js";
import { showToast, showConfirm } from "../utils/toast.js";
import { applyFiltersAndSort } from "../utils/filters.js";
import { statusBadge } from "../utils/ui.js";

/* Cantidad de tareas por página. */
const PAGE_SIZE = 5;

/* Renderiza una tarjeta individual de tarea con botones de editar/eliminar según permisos.
   @param {Object} task - Datos de la tarea.
   @param {Object} currentUser - Usuario autenticado.
   @returns {string} HTML de la tarjeta. */
export const renderTaskCard = (task, currentUser) => {
  /* Determina si el usuario actual puede editar/eliminar esta tarea. */
  const canEdit = isAdmin() || task.ownerId === currentUser.id;
  return `
    <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50" data-task-id="${task.id}">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status.replace("-", " ")}</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">${escapeHtml(task.title)}</h2>
          <p class="mt-3 text-slate-600">${escapeHtml(task.description)}</p>
          <p class="mt-4 text-sm text-slate-500">Creado el ${escapeHtml(task.createdAt)}</p>
          ${task.dueDate ? `<p class="mt-2 text-sm text-slate-500">Vence el ${escapeHtml(task.dueDate)}</p>` : ""}
          ${isAdmin() && task.ownerName ? `<p class="mt-1 text-sm font-medium text-blue-600">${escapeHtml(task.ownerName)}</p>` : ""}
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full px-3 py-1 text-sm font-semibold ${statusBadge(task.status)}">${task.status.replace("-", " ")}</span>
          ${canEdit ? `<button data-action="edit" data-id="${task.id}" class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Editar</button>` : ""}
          ${canEdit ? `<button data-action="delete" data-id="${task.id}" class="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Eliminar</button>` : ""}
        </div>
      </div>
    </article>
  `;
};

/* Aplica filtros, ordenamiento y paginación; renderiza la lista y paginador en el DOM.
   @param {Array} allTasks - Lista completa de tareas.
   @param {Object} user - Usuario autenticado.
   @returns {void} Renderiza directamente en el DOM. */
export const applyUI = (allTasks, user) => {
  /* Lee los filtros activos desde los controles del DOM. */
  const search = document.getElementById("search-tasks")?.value || "";
  const statusFilter = document.getElementById("filter-status")?.value || "all";
  const sortBy = document.getElementById("sort-tasks")?.value || "createdAt";

  /* Filtra y ordena las tareas según los criterios seleccionados. */
  const filtered = applyFiltersAndSort(allTasks, { search, statusFilter, sortBy });

  /* Lee la página actual desde sessionStorage y calcula los límites de paginación. */
  const page = parseInt(sessionStorage.getItem("tasks_page") || "1", 10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageTasks = filtered.slice(start, start + PAGE_SIZE);

  const list = document.getElementById("tasks-list");
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="rounded-[2rem] bg-white p-8 text-center shadow-lg shadow-blue-50"><p class="text-slate-700">${
      search || statusFilter !== "all" ? "No hay tareas que coincidan con los filtros." : "No hay tareas todavía. Crea la primera tarea para comenzar."
    }</p></div>`;
  } else {
    list.innerHTML = pageTasks.map((task) => renderTaskCard(task, user)).join("");
  }

  const pag = document.getElementById("pagination");
  if (pag) {
    if (totalPages <= 1) {
      pag.innerHTML = "";
    } else {
      let html = "";
      html += `<button data-page="${currentPage - 1}" ${currentPage <= 1 ? "disabled" : ""} class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed">Anterior</button>`;
      html += `<span class="text-sm font-medium text-slate-600">Página ${currentPage} de ${totalPages}</span>`;
      html += `<button data-page="${currentPage + 1}" ${currentPage >= totalPages ? "disabled" : ""} class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed">Siguiente</button>`;
      pag.innerHTML = html;

      pag.querySelectorAll("button:not([disabled])").forEach((btn) => {
        btn.addEventListener("click", () => {
          sessionStorage.setItem("tasks_page", btn.dataset.page);
          applyUI(allTasks, user);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    }
  }

  document.querySelectorAll("button[data-action='edit']").forEach((button) => {
    button.addEventListener("click", () => goTo(`/tasks/edit/${button.dataset.id}`));
  });

  document.querySelectorAll("button[data-action='delete']").forEach((button) => {
    button.addEventListener("click", async () => {
      const taskId = button.dataset.id;
      const confirmed = await showConfirm("¿Eliminar esta tarea?");
      if (!confirmed) return;
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Eliminando...";
      try {
        await deleteTask(taskId);
        showToast("Tarea eliminada correctamente", "success");
        sessionStorage.setItem("tasks_page", "1");
        renderList(user);
      } catch (error) {
        showToast(error.message || "Error al eliminar la tarea", "error");
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });
};

/* Obtiene las tareas del backend. Si es admin, incluye todas; si no, solo las del usuario.
   Para administradores, también asigna el nombre del propietario a cada tarea.
   @param {Object} user - Usuario autenticado.
   @returns {Promise<Array>} Lista de tareas enriquecidas. */
export const renderList = async (user) => {
  let fetched = await getTasks({ userId: user.id, includeAll: isAdmin() });
  if (isAdmin()) {
    /* Mapa de id de usuario a nombre para mostrarlo en las tarjetas. */
    const users = await getAllUsers();
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
    fetched = fetched.map((t) => ({ ...t, ownerName: userMap[t.ownerId] || "" }));
  }
  return fetched;
};
