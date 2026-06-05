/* Componente principal de navegación.
   Decide qué layout mostrar según la ruta actual y el estado de autenticación.
   Integra el header, sidebar y las actions asociadas (logout, toggle de tema). */

import { getCurrentUser } from "../services/sessionService.js";
import { logout } from "../services/sessionService.js";
import { goTo } from "../utils/dom.js";
import { toggleTheme, getTheme } from "../utils/theme.js";
import { renderHeader, renderPublicHeader } from "./header.js";
import { renderSidebar, initSidebarActions } from "./sidebar.js";

/* Renderiza el layout de navegación completo.
   @param {string} currentPath - Ruta activa para resaltar enlaces.
   @returns {string} HTML del header público o header + sidebar según el estado. */
export const renderNav = (currentPath = "/") => {
  /* Obtiene el usuario de la sesión activa y determina si está autenticado. */
  const user = getCurrentUser();
  const isAuth = Boolean(user);

  if (currentPath === "/login" || currentPath === "/register") {
    return "";
  }

  if (!isAuth) {
    return renderPublicHeader(currentPath);
  }

  return `
    ${renderHeader(currentPath)}
    ${renderSidebar(currentPath, user.name)}
  `;
};

/* Inicializa los event listeners de la navegación:
   logout, toggle de tema, nombre de usuario y sidebar. */
export const initNavActions = () => {
  /* Botón de cerrar sesión en el header de escritorio. */
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logout();
      goTo("/login");
    });
  }

  /* Botón de cerrar sesión dentro del sidebar móvil. */
  const logoutButtonSidebar = document.getElementById("logout-button-sidebar");
  if (logoutButtonSidebar) {
    logoutButtonSidebar.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) sidebar.classList.add("translate-x-full");
      const overlay = document.getElementById("sidebar-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("block");
      }
      document.body.style.overflow = "";
      logout();
      goTo("/login");
    });
  }

  /* Botón de alternar modo oscuro/claro. */
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = toggleTheme();
      document.querySelectorAll(".theme-toggle").forEach((b) => {
        b.textContent = next === "dark" ? "☀️" : "🌙";
      });
    });
  });

  /* Elemento donde se muestra el nombre del usuario autenticado. */
  const userName = document.getElementById("header-user-name");
  if (userName) {
    const user = getCurrentUser();
    if (user) userName.textContent = user.name;
  }

  initSidebarActions();
};
