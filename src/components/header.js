/* Componente que renderiza el header principal de la aplicación.
   Incluye el logo, enlaces de navegación y controles de tema/autenticación. */

import { getTheme } from "../utils/theme.js";
import { isAdmin } from "../services/sessionService.js";

/* Genera un enlace <a> con clases condicionales según si es la ruta activa.
   @param {string} href - URL del enlace.
   @param {string} label - Texto visible.
   @param {boolean} active - Indica si es la ruta actual.
   @returns {string} HTML del enlace. */
const createLink = (href, label, active = false) => {
  const activeClasses = active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700";
  return `<a data-link href="${href}" class="rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeClasses}">${label}</a>`;
};

/* Renderiza el header para usuarios autenticados con enlaces a Dashboard, Tareas y Perfil.
   @param {string} currentPath - Ruta activa para resaltar enlaces.
   @returns {string} HTML del header completo. */
export const renderHeader = (currentPath = "/") => {
  /* Icono del botón de tema según el modo actual. */
  const themeIcon = getTheme() === "dark" ? "☀️" : "🌙";
  return `
    <header class="sticky top-0 z-40 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 gap-4">
        <a class="text-xl font-black tracking-tight text-blue-900" data-link href="/">TaskFlowSPA</a>
        <nav class="hidden items-center gap-3 md:flex md:flex-1 md:justify-center">
          ${createLink("/dashboard", "Dashboard", currentPath === "/dashboard")}
          ${createLink("/tasks", "Tareas", currentPath === "/tasks")}
          ${createLink("/profile", "Perfil", currentPath === "/profile")}
          ${isAdmin() ? createLink("/admin", "Admin", currentPath === "/admin") : ""}
        </nav>
        <div class="hidden items-center gap-3 md:flex">
          <button id="theme-toggle" class="theme-toggle rounded-full bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200">${themeIcon}</button>
          <span id="header-user-name" class="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"></span>
          <button id="logout-button" class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Cerrar sesión</button>
        </div>
        <div class="flex items-center gap-2 md:hidden">
          <button class="theme-toggle rounded-full bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200">${themeIcon}</button>
          <button id="sidebar-toggle" class="flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 hover:bg-slate-200">
            <svg class="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
    </header>
  `;
};

/* Renderiza el header para visitantes no autenticados con enlaces a Home, Login y Registro.
   @param {string} currentPath - Ruta activa para resaltar enlaces.
   @returns {string} HTML del header público. */
export const renderPublicHeader = (currentPath = "/") => {
  const themeIcon = getTheme() === "dark" ? "☀️" : "🌙";
  return `
    <header class="sticky top-0 z-40 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black tracking-tight text-blue-900" data-link href="/">TaskFlowSPA</a>
        <div class="flex items-center gap-3">
          <button class="theme-toggle rounded-full bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200">${themeIcon}</button>
          <button id="sidebar-toggle" class="flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 hover:bg-slate-200 md:hidden">
            <svg class="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <nav class="hidden items-center gap-3 md:flex">
            ${createLink("/", "Home", currentPath === "/")}
            ${createLink("/login", "Iniciar sesión", currentPath === "/login")}
            ${createLink("/register", "Registrarse", currentPath === "/register")}
          </nav>
        </div>
      </div>
    </header>
  `;
};
