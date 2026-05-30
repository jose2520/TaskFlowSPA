import { isAuthenticated, isAdmin } from "../services/authService.js";
import { goTo } from "../utils/dom.js";
import { renderNav, initNavActions } from "../components/nav.js";
import HomeView from "../views/home.js";
import AuthView from "../views/login-register.js";
import DashboardView from "../views/dashboard.js";
import TasksView from "../views/tasks.js";
import TaskFormView from "../views/task-form.js";
import ProfileView from "../views/profile.js";
import AdminView from "../views/admin.js";
import NotFoundView from "../views/not-found.js";

const routes = [
  { path: "/", component: HomeView, public: true },
  { path: "/login", component: AuthView, public: true },
  { path: "/register", component: AuthView, public: true },
  { path: "/dashboard", component: DashboardView, auth: true },
  { path: "/tasks", component: TasksView, auth: true },
  { path: "/tasks/create", component: TaskFormView, auth: true },
  { path: "/tasks/edit/:id", component: TaskFormView, auth: true },
  { path: "/profile", component: ProfileView, auth: true },
  { path: "/admin", component: AdminView, auth: true, role: "ADMIN" },
  { path: "/404", component: NotFoundView, public: true },
];

const normalizePath = (path) => {
  if (!path) return "/";
  const cleaned = path.replace(/\/+/g, "/");
  return cleaned.length > 1 && cleaned.endsWith("/") ? cleaned.slice(0, -1) : cleaned;
};

const matchRoute = (pathname) => {
  const normalizedPath = normalizePath(pathname);
  const currentSegments = normalizedPath.split("/").filter(Boolean);

  for (const route of routes) {
    const routeSegments = normalizePath(route.path).split("/").filter(Boolean);
    if (routeSegments.length !== currentSegments.length) continue;

    const params = {};
    let isMatch = true;

    for (let index = 0; index < routeSegments.length; index++) {
      const routePart = routeSegments[index];
      const pathPart = currentSegments[index];

      if (routePart.startsWith(":")) {
        const paramName = routePart.slice(1);
        params[paramName] = pathPart;
        continue;
      }

      if (routePart !== pathPart) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) return { route, params };
  }

  return null;
};

const loadView = async (path) => {
  const app = document.querySelector("#app");
  if (!app) return;
  const normalizedPath = normalizePath(path);
  const match = matchRoute(normalizedPath);

  if (!match) {
    goTo("/404");
    return;
  }

  const { route, params } = match;

  if (route.auth && !isAuthenticated()) {
    goTo("/login");
    return;
  }

  if ((route.path === "/login" || route.path === "/register") && isAuthenticated()) {
    goTo("/dashboard");
    return;
  }

  if (route.role === "ADMIN" && !isAdmin()) {
    goTo("/dashboard");
    return;
  }

  const title = route.component.title || "TaskFlowSPA";
  document.title = `${title} | TaskFlowSPA`;
  
  try {
    const isFullscreenRoute = normalizedPath === "/login" || normalizedPath === "/register";
    const viewContent = await route.component.render({ params, currentPath: normalizedPath });
    
    app.innerHTML = `
      ${renderNav(normalizedPath)}
      ${isFullscreenRoute ? viewContent : `<main class="mx-auto w-full max-w-6xl px-6 py-8">${viewContent}</main>`}
    `;

    window.scrollTo(0, 0);
    initNavActions();
    if (route.component.afterRender) {
      await route.component.afterRender({ params });
    }

    animateEntry();
  } catch (error) {
    console.error("Error al cargar la vista:", error);
    app.innerHTML = `
      ${renderNav(normalizedPath)}
      <main class="mx-auto max-w-6xl px-6 py-8">
        <div class="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-lg">
          <p class="text-lg font-semibold text-rose-700">Error al cargar la página</p>
          <p class="mt-2 text-rose-600">${error.message || "Intenta de nuevo más tarde."}</p>
        </div>
      </main>
    `;
  }
};

const animateEntry = () => {
  const app = document.querySelector("#app");
  if (!app) return;
  app.classList.add("page-enter");

  const onAnimationEnd = () => {
    app.classList.remove("page-enter");
    app.removeEventListener("animationend", onAnimationEnd);
  };

  app.addEventListener("animationend", onAnimationEnd);
};

const navigateWithSlide = (href) => {
  const app = document.querySelector("#app");
  if (!app) {
    goTo(href);
    return;
  }

  app.classList.add("page-exit");

  const onAnimationEnd = () => {
    app.classList.remove("page-exit");
    app.removeEventListener("animationend", onAnimationEnd);
    goTo(href);
  };

  app.addEventListener("animationend", onAnimationEnd);
};

const handleLinkClick = (event) => {
  const anchor = event.target.closest("a[data-link]");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

  event.preventDefault();
  navigateWithSlide(href);
};

export const initRouter = () => {
  window.addEventListener("popstate", () => loadView(window.location.pathname));
  document.body.addEventListener("click", handleLinkClick);
  loadView(window.location.pathname);
};
