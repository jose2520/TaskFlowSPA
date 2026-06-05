/*
  main.js
  Punto de entrada de la aplicacion TaskFlowSPA.
  Importa los estilos globales, inicializa el tema (modo oscuro)
  y arranca el router SPA para manejar toda la navegacion.
*/

// Importa los estilos globales (Tailwind + overrides personalizados)
import "./styles/global.css";

// Importa el inicializador del router SPA
import { initRouter } from "./router/index.js";

// Importa la funcion que restaura/configura el tema (claro/oscuro)
import { initTheme } from "./utils/theme.js";

// Aplica el tema persistido en localStorage antes de renderizar
initTheme();

// Inicia el router: escucha popstate, clicks en enlaces y carga la vista actual
initRouter();
