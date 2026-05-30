import { getCurrentUser, isAuthenticated, isAdmin, logout } from "../services/authService.js";
import { goTo } from "../utils/dom.js";

const createLink = (href, label, active = false) => {
  const activeClasses = active ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700";
  return `<a data-link href="${href}" class="rounded-full px-4 py-2 text-sm font-semibold ${activeClasses}">${label}</a>`;
};

export const renderNav = (currentPath = "/") => {
  const user = getCurrentUser();
  const isAuth = Boolean(user);

  if (currentPath === "/login" || currentPath === "/register") {
    return "";
  }

  if (!isAuth) {
    return `
      <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a class="text-xl font-black tracking-tight text-blue-900" data-link href="/">TaskFlowSPA</a>
          <nav class="hidden items-center gap-3 md:flex">
            ${createLink("/", "Home", currentPath === "/")}
            ${createLink("/login", "Iniciar sesión", currentPath === "/login")}
            ${createLink("/register", "Registrarse", currentPath === "/register")}
          </nav>
        </div>
      </header>
    `;
  }

  return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 gap-4">
        <a class="text-xl font-black tracking-tight text-blue-900" data-link href="/">TaskFlowSPA</a>
        <nav class="hidden items-center gap-3 md:flex md:flex-1">
          ${createLink("/dashboard", "Dashboard", currentPath === "/dashboard")}
          ${createLink("/tasks", "Tareas", currentPath === "/tasks")}
          ${createLink("/profile", "Perfil", currentPath === "/profile")}
          ${isAdmin() ? createLink("/admin", "Admin", currentPath === "/admin") : ""}
        </nav>
        <div class="flex items-center gap-3">
          <span class="hidden rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 sm:inline-flex">${user.name}</span>
          <button id="logout-button" class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Cerrar sesión</button>
        </div>
      </div>
    </header>
  `;
};

export const initNavActions = () => {
  const logoutButton = document.getElementById("logout-button");
  if (!logoutButton) return;
  logoutButton.addEventListener("click", () => {
    logout();
    goTo("/login");
  });
};
