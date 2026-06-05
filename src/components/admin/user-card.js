/* Componente que renderiza una tarjeta de usuario para el panel de administración.
   Muestra nombre, email, rol, acciones (cambiar rol, eliminar) y tareas asociadas. */

import { escapeHtml } from "../../utils/dom.js";
import { statusBadge } from "../../utils/ui.js";

/* Renderiza una tarjeta de usuario con sus datos, acciones administrativas y lista de tareas.
   @param {Object} user - Datos del usuario a mostrar.
   @param {Object} currentUser - Usuario autenticado (admin).
   @param {Array} tasks - Tareas asignadas a este usuario.
   @returns {string} HTML de la tarjeta. */
export const renderUserCard = (user, currentUser, tasks = []) => {
  /* Determina si el usuario mostrado es el mismo que el autenticado para ocultar acciones sobre sí mismo. */
  const isCurrent = user.id === currentUser.id;
  return `
    <div class="rounded-2xl bg-blue-50 p-4" data-user-id="${user.id}">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex-1">
          <p class="font-bold text-slate-900">${escapeHtml(user.name)}</p>
          <p class="text-sm text-slate-500">${escapeHtml(user.email)}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">${user.role}</span>
          <button data-action="toggle-tasks" data-id="${user.id}" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white">
            Tareas (${tasks.length})
          </button>
          ${!isCurrent ? `<button data-action="toggle-role" data-id="${user.id}" class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-white">Cambiar rol</button>` : ""}
          ${!isCurrent ? `<button data-action="delete-user" data-id="${user.id}" class="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Eliminar</button>` : ""}
        </div>
      </div>

      <div id="tasks-${user.id}" class="mt-4 hidden space-y-3">
        ${tasks.length === 0
          ? '<p class="rounded-xl bg-white p-4 text-sm text-slate-500">Este usuario no tiene tareas.</p>'
          : tasks.map((task) => `
            <div class="rounded-xl bg-white p-4">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-bold text-slate-900">${escapeHtml(task.title)}</p>
                  ${task.description ? `<p class="mt-1 text-sm text-slate-500 truncate">${escapeHtml(task.description)}</p>` : ""}
                  <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>Creado: ${escapeHtml(task.createdAt)}</span>
                    ${task.dueDate ? `<span>Vence: ${escapeHtml(task.dueDate)}</span>` : ""}
                  </div>
                </div>
                <span class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(task.status)}">${task.status.replace("-", " ")}</span>
              </div>
            </div>
          `).join("")}
      </div>
    </div>
  `;
};
