/* Componente que renderiza el sidebar responsive (menú lateral móvil).
   Contiene enlaces de navegación y control de cierre de sesión. */

import { isAdmin } from "../services/sessionService.js";

/* Genera un enlace para el sidebar con estilos condicionales según la ruta activa.
   @param {string} href - URL del enlace.
   @param {string} label - Texto visible del enlace.
   @param {boolean} active - Indica si es la ruta actual.
   @returns {string} HTML del enlace. */
const createSidebarLink = (href, label, active = false) => {
  const activeClasses = active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700";
  return `<a data-link href="${href}" class="flex rounded-full px-4 py-2 text-sm font-semibold ${activeClasses}">${label}</a>`;
};

/* Renderiza el sidebar móvil con overlay, nombre de usuario, enlaces y botón de logout.
   @param {string} currentPath - Ruta activa para resaltar enlaces.
   @param {string} userName - Nombre del usuario autenticado.
   @returns {string} HTML del sidebar y su overlay. */
export const renderSidebar = (currentPath = "/", userName = "") => {
  return `
    <div id="sidebar-overlay" class="fixed inset-0 z-40 hidden bg-black/30 backdrop-blur-sm"></div>
    <aside id="sidebar" class="fixed top-0 right-0 z-50 flex h-full w-72 translate-x-full flex-col gap-6 border-l border-blue-100 bg-white p-6 shadow-2xl transition-transform duration-300">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-slate-900">${userName}</span>
        <button id="sidebar-close" class="flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 hover:bg-slate-200">
          <svg class="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="flex flex-col gap-2">
        ${createSidebarLink("/dashboard", "Dashboard", currentPath === "/dashboard")}
        ${createSidebarLink("/tasks", "Tareas", currentPath === "/tasks")}
        ${createSidebarLink("/profile", "Perfil", currentPath === "/profile")}
        ${isAdmin() ? createSidebarLink("/admin", "Admin", currentPath === "/admin") : ""}
      </nav>
      <div class="mt-auto flex flex-col gap-3 border-t border-blue-100 pt-6">
        <button id="logout-button-sidebar" class="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">Cerrar sesión</button>
      </div>
    </aside>
  `;
};

/* Inicializa los event listeners de apertura y cierre del sidebar.
   También cierra el sidebar al hacer clic en un enlace interno. */
export const initSidebarActions = () => {
  /* Referencias a los elementos del control del sidebar. */
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  /* Abre el sidebar y bloquea el scroll del body. */
  const openSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("translate-x-full");
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.classList.add("block");
    }
    document.body.style.overflow = "hidden";
  };

  /* Cierra el sidebar y restaura el scroll del body. */
  const closeSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.add("translate-x-full");
    if (overlay) {
      overlay.classList.add("hidden");
      overlay.classList.remove("block");
    }
    document.body.style.overflow = "";
  };

  if (sidebarToggle) sidebarToggle.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  document.querySelectorAll("#sidebar a[data-link]").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });
};
