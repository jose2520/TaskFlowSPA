/* Componente que renderiza el tablero Kanban con columnas de estado (Pendientes, En progreso, Completadas).
   Incluye drag & drop para cambiar el estado de las tareas, edición y eliminación. */

import { escapeHtml, goTo } from "../utils/dom.js";
import { showToast, showConfirm } from "../utils/toast.js";
import { deleteTask, updateTask } from "../services/taskService.js";
import { getCurrentUser, isAdmin } from "../services/authService.js";
import { applyFiltersAndSort } from "../utils/filters.js";

/* Renderiza el tablero Kanban aplicando filtros y ordenamiento.
   @param {Array} allTasks - Lista completa de tareas a mostrar.
   @returns {void} Renderiza directamente en el DOM. */
export const renderKanban = (allTasks) => {
  /* Obtiene valores de búsqueda y orden desde el DOM, luego filtra/ordena las tareas. */
  const search = document.getElementById("search-tasks")?.value || "";
  const sortBy = document.getElementById("sort-tasks")?.value || "createdAt";
  const filtered = applyFiltersAndSort(allTasks, { search, statusFilter: "all", sortBy });

  /* Agrupa las tareas filtradas por estado en columnas. */
  const columns = { pending: [], "in-progress": [], completed: [] };
  for (const t of filtered) {
    if (columns[t.status]) columns[t.status].push(t);
  }

  /* Referencias al contenedor Kanban, lista de tareas y paginación. */
  const currentUser = getCurrentUser();
  const kanban = document.getElementById("kanban-board");
  const list = document.getElementById("tasks-list");
  const pag = document.getElementById("pagination");
  if (!kanban) return;

  list.classList.add("hidden");
  kanban.classList.remove("hidden");
  if (pag) pag.innerHTML = "";

  /* Configuración de etiquetas, colores de columna y colores de cabecera por estado. */
  const labels = { pending: "Pendientes", "in-progress": "En progreso", completed: "Completadas" };
  const colors = { pending: "bg-amber-100 border-amber-200", "in-progress": "bg-sky-100 border-sky-200", completed: "bg-emerald-100 border-emerald-200" };
  const headerColors = { pending: "text-amber-700 bg-amber-50", "in-progress": "text-sky-700 bg-sky-50", completed: "text-emerald-700 bg-emerald-50" };

  kanban.innerHTML = Object.entries(columns).map(([status, tasks]) => `
    <div class="rounded-3xl border-2 ${colors[status]} p-4" data-status="${status}" ondragover="event.preventDefault()" data-drop-zone>
      <div class="mb-4 rounded-2xl ${headerColors[status]} px-4 py-2 text-center text-sm font-bold uppercase tracking-wider">
        ${labels[status]} <span class="ml-1">(${tasks.length})</span>
      </div>
      <div class="flex flex-col gap-3 min-h-[120px]">
        ${tasks.length === 0
          ? '<p class="py-8 text-center text-xs text-slate-400">Arrastra tareas aquí</p>'
          : tasks.map((task) => `
            <div class="cursor-grab rounded-2xl border border-blue-100 bg-white p-4 shadow-sm active:cursor-grabbing"
                 draggable="true"
                 data-task-id="${task.id}"
                 data-status="${task.status}">
              <p class="text-sm font-bold text-slate-900">${escapeHtml(task.title)}</p>
              ${task.description ? `<p class="mt-1 text-xs text-slate-500 truncate">${escapeHtml(task.description)}</p>` : ""}
              <div class="mt-2 flex items-center justify-between">
                <span class="text-[10px] text-slate-400">${escapeHtml(task.createdAt)}</span>
                <div class="flex gap-1">
                  ${isAdmin() || task.ownerId === currentUser?.id ? `<button data-action="edit" data-id="${task.id}" class="rounded-full border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-50">✎</button>` : ""}
                  ${isAdmin() || task.ownerId === currentUser?.id ? `<button data-action="delete" data-id="${task.id}" class="rounded-full border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700 hover:bg-rose-50">✕</button>` : ""}
                </div>
              </div>
            </div>
          `).join("")}
      </div>
    </div>
  `).join("");

  /* Eventos de drag & drop en las tarjetas arrastrables. */
  kanban.querySelectorAll("[draggable]").forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", el.dataset.taskId);
      el.classList.add("opacity-40");
    });
    el.addEventListener("dragend", (e) => {
      el.classList.remove("opacity-40");
    });
  });

  /* Eventos de drop zone en cada columna para recibir tareas arrastradas. */
  kanban.querySelectorAll("[data-drop-zone]").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("ring-2", "ring-blue-400");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("ring-2", "ring-blue-400");
    });
    zone.addEventListener("drop", async (e) => {
      e.preventDefault();
      zone.classList.remove("ring-2", "ring-blue-400");
      const taskId = e.dataTransfer.getData("text/plain");
      const newStatus = zone.dataset.status;
      const task = allTasks.find((t) => t.id === taskId);
      if (!task || task.status === newStatus) return;
      try {
        await updateTask(taskId, { title: task.title, description: task.description, status: newStatus, dueDate: task.dueDate || "" });
        task.status = newStatus;
        renderKanban(allTasks);
        showToast("Tarea movida a " + (newStatus === "in-progress" ? "en progreso" : newStatus), "success");
      } catch (err) {
        showToast(err.message || "Error al mover la tarea", "error");
      }
    });
  });

  /* Listeners para botones de editar y eliminar dentro del Kanban. */
  document.querySelectorAll("#kanban-board button[data-action='edit']").forEach((btn) => {
    btn.addEventListener("click", () => goTo(`/tasks/edit/${btn.dataset.id}`));
  });
  document.querySelectorAll("#kanban-board button[data-action='delete']").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const taskId = btn.dataset.id;
      const confirmed = await showConfirm("¿Eliminar esta tarea?");
      if (!confirmed) return;
      btn.disabled = true;
      try {
        await deleteTask(taskId);
        showToast("Tarea eliminada", "success");
        renderKanban(allTasks);
      } catch (err) {
        showToast(err.message || "Error", "error");
      }
    });
  });
};
