/*
  router/index.js
  Router SPA (Single Page Application) de TaskFlowSPA.
  Gestiona la navegacion del lado del cliente usando la History API,
  carga vistas de forma diferida (lazy loading con import() dinamico),
  y ejecuta guards de autenticacion y roles antes de renderizar.
*/

// Servicios de autenticacion: verifica sesion activa y rol ADMIN
import { isAuthenticated, isAdmin } from "../services/authService.js";

// Utilidad de navegacion: modifica la URL sin recargar la pagina
import { goTo } from "../utils/dom.js";

// Componentes de navegacion: renderiza la barra de navegacion y vincula sus eventos
import { renderNav, initNavActions } from "../components/nav.js";

/*
  routes: Definicion del mapa de rutas de la aplicacion.
  Cada ruta puede tener:
    - path:     patron de URL (puede incluir parametros como :id o :token).
    - load:     funcion que retorna un import() dinamico para carga lazy de la vista.
    - public:   si es true, la ruta es accesible sin autenticacion.
    - auth:     si es true, requiere que el usuario este autenticado.
    - role:     si esta presente, restringe el acceso al rol indicado (ej. "ADMIN").
*/
const routes = [
  { path: "/", load: () => import("../views/home.js"), public: true },
  { path: "/login", load: () => import("../views/login-register.js"), public: true },
  { path: "/register", load: () => import("../views/login-register.js"), public: true },
  { path: "/dashboard", load: () => import("../views/dashboard.js"), auth: true },
  { path: "/tasks", load: () => import("../views/tasks.js"), auth: true },
  { path: "/tasks/create", load: () => import("../views/task-form.js"), auth: true },
  { path: "/tasks/edit/:id", load: () => import("../views/task-form.js"), auth: true },
  { path: "/profile", load: () => import("../views/profile.js"), auth: true },
  { path: "/admin", load: () => import("../views/admin.js"), auth: true, role: "ADMIN" },
  { path: "/recovery", load: () => import("../views/recovery.js"), public: true },
  { path: "/recovery/:token", load: () => import("../views/recovery.js"), public: true },
  { path: "/404", load: () => import("../views/not-found.js"), public: true },
];

/*
  normalizePath: Normaliza una URL eliminando barras duplicadas y
  la barra final (excepto para la raiz "/").
  @param {string} path - Ruta a normalizar.
  @returns {string} Ruta normalizada.
*/
const normalizePath = (path) => {
  if (!path) return "/";
  const cleaned = path.replace(/\/+/g, "/");
  return cleaned.length > 1 && cleaned.endsWith("/") ? cleaned.slice(0, -1) : cleaned;
};

/*
  matchRoute: Busca una ruta definida en el arreglo `routes` que coincida
  con el pathname proporcionado. Soporta parametros dinamicos (ej. :id).
  @param {string} pathname - Ruta de la URL a matchear.
  @returns {object|null} Objeto con { route, params } o null si no hay coincidencia.
*/
const matchRoute = (pathname) => {
  // Normaliza la URL y la divide en segmentos
  const normalizedPath = normalizePath(pathname);
  const currentSegments = normalizedPath.split("/").filter(Boolean);

  // Itera sobre todas las rutas registradas buscando coincidencia
  for (const route of routes) {
    const routeSegments = normalizePath(route.path).split("/").filter(Boolean);
    // Si la cantidad de segmentos no coincide, descarta la ruta
    if (routeSegments.length !== currentSegments.length) continue;

    // Extrae parametros dinamicos (segmentos que empiezan con ":")
    const params = {};
    let isMatch = true;

    for (let index = 0; index < routeSegments.length; index++) {
      const routePart = routeSegments[index];
      const pathPart = currentSegments[index];

      // Si el segmento es dinamico (ej. :id), captura su valor
      if (routePart.startsWith(":")) {
        const paramName = routePart.slice(1);
        params[paramName] = pathPart;
        continue;
      }

      // Si el segmento no coincide, la ruta no es valida
      if (routePart !== pathPart) {
        isMatch = false;
        break;
      }
    }

    // Si todos los segmentos coincidieron, retorna la ruta y sus parametros
    if (isMatch) return { route, params };
  }

  // Ninguna ruta coincidio
  return null;
};

/*
  loadView: Funcion principal del router. Obtiene el contenedor #app,
  resuelve la ruta, ejecuta guards de autenticacion/rol, carga la vista
  con import() dinamico (lazy loading), renderiza el layout y la vista,
  y ejecuta hooks post-render.
  @param {string} path - Ruta a cargar (ej. "/tasks").
  @returns {Promise<void>}
*/
const loadView = async (path) => {
  // Referencia al contenedor raiz donde se inyecta el HTML
  const app = document.querySelector("#app");
  if (!app) return;

  // Normaliza la ruta y busca una coincidencia en el mapa de rutas
  const normalizedPath = normalizePath(path);
  const match = matchRoute(normalizedPath);

  // Si no hay coincidencia, redirige a la pagina 404
  if (!match) {
    goTo("/404");
    return;
  }

  const { route, params } = match;

  // GUARD: Si la ruta requiere autenticacion y el usuario no ha iniciado sesion,
  // redirige al login
  if (route.auth && !isAuthenticated()) {
    goTo("/login");
    return;
  }

  // GUARD: Si el usuario ya esta autenticado e intenta ir a login/register,
  // redirige al dashboard
  if ((route.path === "/login" || route.path === "/register") && isAuthenticated()) {
    goTo("/dashboard");
    return;
  }

  // GUARD: Si la ruta requiere rol ADMIN y el usuario no lo es, redirige al dashboard
  if (route.role === "ADMIN" && !isAdmin()) {
    goTo("/dashboard");
    return;
  }

  try {
    // LAZY LOADING: import() dinamico que carga la vista solo cuando se necesita
    const module = await route.load();
    // Cada modulo debe exportar por defecto un objeto con .render() y opcionalmente .afterRender()
    const component = module.default;

    // Actualiza el titulo de la pestana del navegador
    const title = component.title || "TaskFlowSPA";
    document.title = `${title} | TaskFlowSPA`;

    // Las rutas de login/register se renderizan a pantalla completa (sin restriccion de ancho)
    const isFullscreenRoute = normalizedPath === "/login" || normalizedPath === "/register";
    const viewContent = await component.render({ params, currentPath: normalizedPath });

    // Renderiza el layout completo: barra de navegacion + contenido de la vista
    app.innerHTML = `
      ${renderNav(normalizedPath)}
      ${isFullscreenRoute ? viewContent : `<main class="mx-auto w-full max-w-6xl px-6 py-8">${viewContent}</main>`}
    `;

    // Scroll al inicio de la pagina tras cada navegacion
    window.scrollTo(0, 0);

    // Vincula los eventos de la barra de navegacion (ej. toggle sidebar)
    initNavActions();

    // Hook post-render: permite a la vista ejecutar logica adicional
    // (ej. listeners, graficas) una vez que el DOM ya esta en el documento
    if (component.afterRender) {
      await component.afterRender({ params });
    }

    // Animacion de entrada (transicion CSS) al cambiar de vista
    animateEntry();
  } catch (error) {
    // Si ocurre un error al cargar la vista, muestra un mensaje de error amigable
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

/*
  animateEntry: Agrega una clase CSS de transicion al contenedor #app
  para reproducir una animacion de entrada al cambiar de vista.
  La animacion se autolimpia al terminar.
*/
const animateEntry = () => {
  const main = document.querySelector("#app > main");
  if (!main) return;
  main.classList.add("page-enter");

  // Al finalizar la animacion, remueve la clase y el listener
  const onAnimationEnd = () => {
    main.classList.remove("page-enter");
    main.removeEventListener("animationend", onAnimationEnd);
  };

  main.addEventListener("animationend", onAnimationEnd);
};

/*
  handleLinkClick: Intercepta clicks en enlaces con atributo "data-link"
  para navegar sin recargar la pagina (navegacion SPA).
  Ignora enlaces externos (http) y de correo (mailto:).
  @param {Event} event - Evento de click.
*/
const handleLinkClick = (event) => {
  // Busca el elemento <a> mas cercano con el atributo data-link
  const anchor = event.target.closest("a[data-link]");
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  // Ignora enlaces externos y de correo electronico
  if (!href || href.startsWith("http") || href.startsWith("mailto:")) return;

  // Evita la navegacion tradicional y usa el router SPA
  event.preventDefault();
  goTo(href);
};

/*
  initRouter: Inicializa el router SPA.
  - Escucha el evento popstate (navegacion con botones atras/adelante).
  - Escucha clicks en toda la pagina para interceptar enlaces internos.
  - Carga la vista correspondiente a la URL actual.
  Esta funcion se exporta y se invoca desde main.js.
*/
export const initRouter = () => {
  // popstate: se dispara al navegar con los botones atras/adelante del navegador
  window.addEventListener("popstate", () => loadView(window.location.pathname));

  // Delega la captura de clicks en enlaces internos con data-link
  document.body.addEventListener("click", handleLinkClick);

  // Carga la vista inicial basada en la URL actual
  loadView(window.location.pathname);
};
