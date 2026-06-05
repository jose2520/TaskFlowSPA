/*
 * Vista del Dashboard principal.
 * Muestra el resumen de productividad del usuario autenticado:
 * total de tareas activas, completadas y pendientes, junto con
 * accesos rápidos a crear tareas y editar perfil.
 */

// Servicio de autenticación: obtener usuario actual
import { getCurrentUser, isAdmin } from "../services/authService.js";
// Servicio de tareas: obtener conteo de tareas por estado
import { getTaskCounts } from "../services/taskService.js";
// Utilidad DOM: escapar HTML para prevenir XSS
import { escapeHtml } from "../utils/dom.js";

export default {
  title: "Dashboard",
  // render: construye el HTML del dashboard con saludo, contadores y accesos rápidos
  render: async () => {
    const user = getCurrentUser();
    let counts = { total: 0, completed: 0, pending: 0 };

    try {
      const includeAll = isAdmin();
      counts = await getTaskCounts({ userId: user?.id, includeAll });
    } catch (error) {
      console.error("Error al obtener conteo de tareas:", error);
    }

    return `
      <!-- Hero: saludo al usuario y descripción del dashboard -->
      <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Dashboard principal</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Bienvenida, ${escapeHtml(user?.name || "usuario")}.</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Resumen general del trabajo del usuario, accesos r&aacute;pidos y estado actual de productividad.</p>
      </section>

      <!-- Contadores: total de tareas activas, completadas y pendientes -->
      <section class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Tareas activas</p>
          <p class="mt-3 text-4xl font-black text-blue-700">${counts.total}</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Completadas</p>
          <p class="mt-3 text-4xl font-black text-blue-700">${counts.completed}</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Pendientes hoy</p>
          <p class="mt-3 text-4xl font-black text-blue-700">${counts.pending}</p>
        </article>
      </section>

      <!-- Accesos rápidos: enlaces a crear tarea y editar perfil -->
      <section class="mt-8">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Accesos r&aacute;pidos</h2>
            <a data-link href="/tasks" class="text-sm font-semibold text-blue-700 hover:text-blue-600">Ver tareas</a>
          </div>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <a data-link href="/tasks/create" class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100">
              <p class="text-sm font-semibold text-blue-600">Crear</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">Nueva tarea</h3>
            </a>
            <a data-link href="/profile" class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100">
              <p class="text-sm font-semibold text-blue-600">Cuenta</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">Editar perfil</h3>
            </a>
          </div>
        </article>
      </section>
    `;
  },
};
