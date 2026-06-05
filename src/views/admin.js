/*
 * Vista del panel administrativo.
 * Renderiza estadísticas de tareas, acciones rápidas, gestión de usuarios
 * (cambiar rol, eliminar), log de actividad reciente y botones de
 * exportación de datos (JSON/CSV). Solo accesible para rol ADMIN.
 */

// Servicio de autenticación: obtener usuarios, cambiar rol, eliminar cuenta
import { getAllUsers, changeUserRole, deleteAccount, getCurrentUser } from "../services/authService.js";
// Servicio de tareas: obtener todas y eliminar tareas de un usuario
import { getTasks, deleteTasksForUser } from "../services/taskService.js";
// Utilidad DOM: escapar HTML para prevenir XSS
import { escapeHtml } from "../utils/dom.js";
// Utilidad de notificaciones: toast y confirmación modal
import { showToast, showConfirm, showFormatPicker } from "../utils/toast.js";
// Servicio de log: obtener y limpiar registro de actividad
import { getLog, clearLog } from "../services/logService.js";
// Utilidad UI: badge de estado para tareas
import { statusBadge } from "../utils/ui.js";
// Componente: tarjeta de usuario para el panel de administración
import { renderUserCard } from "../components/admin/user-card.js";
// Utilidad de exportación: formatos JSON y CSV
import { exportAsJSON, exportAsCSV } from "../utils/export.js";

/**
 * Renderiza una barra de progreso horizontal con etiqueta y contador.
 * @param {string} label - Texto descriptivo de la barra.
 * @param {number} count - Cantidad de elementos en esta categoría.
 * @param {number} total - Total de elementos para calcular porcentaje.
 * @param {string} color - Clase Tailwind CSS para el color de relleno.
 * @returns {string} HTML de la barra de progreso.
 */
const bar = (label, count, total, color) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return `
    <div>
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="font-medium text-slate-700">${label}</span>
        <span class="text-slate-500">${count}</span>
      </div>
      <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full ${color} transition-all" style="width:${pct}%"></div>
      </div>
    </div>
  `;
};

/**
 * Renderiza un elemento individual del log de actividad.
 * @param {Object} entry - Entrada con timestamp, action, detail y user.
 * @returns {string} HTML del elemento del log.
 */
const renderLogItem = (entry) => {
  const date = new Date(entry.timestamp);
  const time = date.toLocaleString("es-CO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  return `
    <div class="flex items-start gap-3 rounded-xl bg-blue-50 p-3">
      <span class="mt-0.5 shrink-0 rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">${escapeHtml(entry.action)}</span>
      <div class="min-w-0 flex-1">
        <p class="text-sm text-slate-700">${escapeHtml(entry.detail)}</p>
        <p class="text-xs text-slate-400 mt-0.5">${time} — ${escapeHtml(entry.user)}</p>
      </div>
    </div>
  `;
};

export default {
  title: "Admin",
  // render: construye el HTML completo con estadísticas, usuarios, log y exportación
  render: async () => {
    const currentUser = getCurrentUser();
    let users = [], allTasks = [], logs = [];
    try {
      users = await getAllUsers();
      allTasks = await getTasks({ includeAll: true });
      logs = getLog().slice(0, 20);
    } catch (error) {
      console.error("Error al cargar datos del admin:", error);
    }

    const tasksByUser = {};
    let totalPending = 0, totalInProgress = 0, totalCompleted = 0;
    for (const task of allTasks) {
      if (!tasksByUser[task.ownerId]) tasksByUser[task.ownerId] = [];
      tasksByUser[task.ownerId].push(task);
      if (task.status === "pending") totalPending++;
      else if (task.status === "in-progress") totalInProgress++;
      else if (task.status === "completed") totalCompleted++;
    }
    const total = allTasks.length;

    return `
      <section class="grid gap-6">
        <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Rol administrador</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
          <p class="mt-4 max-w-2xl text-blue-50">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
        </section>

        <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <!-- Estadísticas: totales de tareas y barras de progreso -->
            <h2 class="text-xl font-bold text-slate-900">Estad&iacute;sticas</h2>
            <div class="mt-5 space-y-4">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="rounded-2xl bg-amber-50 p-4">
                  <p class="text-2xl font-black text-amber-700">${totalPending}</p>
                  <p class="text-xs font-medium text-amber-600 mt-1">Pendientes</p>
                </div>
                <div class="rounded-2xl bg-sky-50 p-4">
                  <p class="text-2xl font-black text-sky-700">${totalInProgress}</p>
                  <p class="text-xs font-medium text-sky-600 mt-1">En progreso</p>
                </div>
                <div class="rounded-2xl bg-emerald-50 p-4">
                  <p class="text-2xl font-black text-emerald-700">${totalCompleted}</p>
                  <p class="text-xs font-medium text-emerald-600 mt-1">Completadas</p>
                </div>
              </div>
              <div class="space-y-3 pt-2">
                ${bar("Pendientes", totalPending, total, "bg-amber-400")}
                ${bar("En progreso", totalInProgress, total, "bg-sky-400")}
                ${bar("Completadas", totalCompleted, total, "bg-emerald-400")}
              </div>
            </div>
          </article>

          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <div class="flex items-center justify-between">
              <!-- Acciones rápidas: enlaces de navegación y botones de exportación -->
              <h2 class="text-xl font-bold text-slate-900">Acciones r&aacute;pidas</h2>
            </div>
            <div class="mt-5 grid gap-4">
              <a data-link href="/tasks" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">Ver todas las tareas</a>
              <a data-link href="/dashboard" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">Volver al dashboard</a>
              <button id="export-users" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 text-left">Exportar usuarios</button>
              <button id="export-tasks" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 text-left">Exportar tareas</button>
            </div>
          </article>
        </section>

        <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <div class="flex items-center justify-between">
              <!-- Usuarios: tarjetas de usuario con tareas agrupadas por propietario -->
              <h2 class="text-xl font-bold text-slate-900">Usuarios y sus tareas</h2>
              <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">${users.length} usuarios</span>
            </div>
            <div class="mt-5 space-y-4">
              ${users.map((user) => renderUserCard(user, currentUser, tasksByUser[user.id] || [])).join("")}
            </div>
          </article>

          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <div class="flex items-center justify-between">
              <!-- Log de actividad: entradas recientes del sistema -->
              <h2 class="text-xl font-bold text-slate-900">Actividad reciente</h2>
              <button id="clear-log" class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50">Limpiar</button>
            </div>
            <div id="log-list" class="mt-5 space-y-2">
              ${logs.length === 0
                ? '<p class="text-sm text-slate-500 text-center py-4">No hay actividad registrada.</p>'
                : logs.map(renderLogItem).join("")}
            </div>
          </article>
        </section>
      </section>
    `;
  },
  // afterRender: registra event listeners para toggle tareas, toggle rol, eliminar usuario, exportar y limpiar log
  afterRender: () => {
    // Toggle tareas: muestra u oculta las tareas del usuario en su tarjeta
    document.querySelectorAll("button[data-action='toggle-tasks']").forEach((button) => {
      button.addEventListener("click", () => {
        const userId = button.dataset.id;
        const container = document.getElementById(`tasks-${userId}`);
        if (!container) return;
        const isHidden = container.classList.contains("hidden");
        container.classList.toggle("hidden");
        const taskCount = container.querySelectorAll("div.rounded-xl").length;
        button.textContent = isHidden ? `Ocultar tareas (${taskCount})` : `Tareas (${taskCount})`;
      });
    });

    // Toggle rol: cambia el rol del usuario entre ADMIN y USER
    document.querySelectorAll("button[data-action='toggle-role']").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const userId = button.dataset.id;
          const allUsers = await getAllUsers();
          const user = allUsers.find((item) => item.id === userId);
          if (!user) return;
          const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
          const confirmed = await showConfirm(
            `¿Cambiar rol de <strong>${user.name}</strong> a <strong>${nextRole}</strong>?`
          );
          if (!confirmed) return;
          await changeUserRole(userId, nextRole);
          showToast(`Rol cambiado a ${nextRole}`, "success");
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (error) {
          showToast(error.message || "Error al cambiar el rol", "error");
        }
      });
    });

    // Eliminar usuario: borra usuario y sus tareas tras confirmación modal
    document.querySelectorAll("button[data-action='delete-user']").forEach((button) => {
      button.addEventListener("click", async () => {
        const userId = button.dataset.id;
        const confirmed = await showConfirm("¿Eliminar este usuario y sus tareas?");
        if (!confirmed) return;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = "Eliminando...";
        try {
          await deleteTasksForUser(userId);
          await deleteAccount(userId);
          showToast("Usuario eliminado correctamente", "success");
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (error) {
          showToast(error.message || "Error al eliminar el usuario", "error");
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });

    // Exportar usuarios: modal para elegir JSON o CSV
    document.getElementById("export-users")?.addEventListener("click", async () => {
      try {
        const format = await showFormatPicker("¿En qué formato deseas exportar los usuarios?");
        if (!format) return;
        const users = await getAllUsers();
        const date = new Date().toISOString().slice(0, 10);
        if (format === "json") {
          exportAsJSON(users, `usuarios_${date}`);
        } else {
          exportAsCSV(users, `usuarios_${date}`, ["id", "name", "email", "role"]);
        }
        showToast(`Usuarios exportados (${format.toUpperCase()})`, "success");
      } catch (error) {
        showToast(error.message || "Error al exportar usuarios", "error");
      }
    });

    // Exportar tareas: modal para elegir JSON o CSV, incluye dueño
    document.getElementById("export-tasks")?.addEventListener("click", async () => {
      try {
        const format = await showFormatPicker("¿En qué formato deseas exportar las tareas?");
        if (!format) return;
        const [tasks, users] = await Promise.all([getTasks({ includeAll: true }), getAllUsers()]);
        const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
        const enriched = tasks.map((t) => ({ ...t, ownerName: userMap[t.ownerId] || "Desconocido" }));
        const date = new Date().toISOString().slice(0, 10);
        if (format === "json") {
          exportAsJSON(enriched, `tareas_${date}`);
        } else {
          exportAsCSV(enriched, `tareas_${date}`, ["id", "title", "description", "status", "ownerName", "ownerId", "createdAt", "dueDate"]);
        }
        showToast(`Tareas exportadas (${format.toUpperCase()})`, "success");
      } catch (error) {
        showToast(error.message || "Error al exportar tareas", "error");
      }
    });

    // Limpiar log: borra todo el registro de actividad del sistema
    document.getElementById("clear-log")?.addEventListener("click", () => {
      clearLog();
      const list = document.getElementById("log-list");
      if (list) list.innerHTML = '<p class="text-sm text-slate-500 text-center py-4">No hay actividad registrada.</p>';
      showToast("Log limpiado", "success");
    });
  },
};
