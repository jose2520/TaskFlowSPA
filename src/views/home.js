/*
 * Vista de inicio (Home).
 * Página de aterrizaje pública con descripción del proyecto y enlaces
 * a las vistas principales: login, registro, dashboard, tareas,
 * perfil y panel admin.
 */

import { isAdmin } from "../services/authService.js";

export default {
  title: "Home",
  // render: construye el HTML de la landing page con hero, descripción y enlaces a vistas
  render: async () => `
    <!-- Hero principal: descripción del proyecto y botones de autenticación -->
    <section class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div>
        <p class="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Organiza tu trabajo con calma</p>
        <h1 class="mt-6 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
          Una plataforma clara para gestionar tareas, usuarios y productividad.
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          TaskFlowSPA presenta el recorrido principal del proyecto con una interfaz uniforme, amable y lista para convertirse luego en una SPA real con autenticación, roles, permisos y CRUD de tareas.
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a data-link href="/login" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-500">Iniciar sesión</a>
          <a data-link href="/register" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Crear cuenta</a>
        </div>
      </div>

      <!-- Panel de vistas: tarjetas con enlaces a las secciones principales -->
      <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70">
        <h2 class="text-2xl font-bold text-slate-900">Vistas del proyecto</h2>
        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <a data-link href="/dashboard" class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100">
            <p class="text-sm font-semibold text-blue-600">Dashboard</p>
            <p class="mt-2 text-sm text-slate-600">Resumen principal de productividad.</p>
          </a>
          <a data-link href="/tasks" class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100">
            <p class="text-sm font-semibold text-blue-600">Mis tareas</p>
            <p class="mt-2 text-sm text-slate-600">CRUD principal del usuario.</p>
          </a>
          <a data-link href="/profile" class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100">
            <p class="text-sm font-semibold text-blue-600">Mi perfil</p>
            <p class="mt-2 text-sm text-slate-600">Actualizar cuenta y datos personales.</p>
          </a>
          ${isAdmin() ? `<a data-link href="/admin" class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100">
            <p class="text-sm font-semibold text-blue-600">Admin</p>
            <p class="mt-2 text-sm text-slate-600">Panel reservado para administradores.</p>
          </a>` : ""}
        </div>
      </section>
    </section>
  `,
};
