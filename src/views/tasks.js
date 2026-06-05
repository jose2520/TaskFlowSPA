// Vista de listado de tareas
// Muestra las tareas del usuario en formato lista paginada o vista kanban con opciones de filtro y ordenamiento.

// Importa servicios de autenticación para conocer el usuario actual
import { getCurrentUser } from "../services/authService.js";
// Importa componente kanban para renderizar el tablero drag & drop
import { renderKanban } from "../components/kanban.js";
// Importa utilidades de la lista de tareas: applyUI (paginación/filtros) y renderList (alias fetchTasks)
import { applyUI, renderList as fetchTasks } from "../components/task-list.js";

export default {
  // Título de la página
  title: "Tareas",

  // render: genera el HTML del listado de tareas con barra de herramientas (búsqueda, filtro, orden, toggle kanban)
  // @returns {string} HTML con encabezado, controles y contenedores para lista/kanban/paginación
  render: async () => {
    return `
      <section class="grid gap-4">
        <!-- Encabezado con título y botón para crear nueva tarea -->
        <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">CRUD de tareas</p>
          <h1 class="mt-4 text-4xl font-black tracking-tight">Mis tareas</h1>
          <p class="mt-4 max-w-2xl text-blue-100">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
          <a data-link href="/tasks/create" class="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Crear tarea</a>
        </section>

        <!-- Barra de herramientas con búsqueda, filtro por estado, ordenamiento y toggle de vista kanban -->
        <div class="flex flex-wrap items-center gap-3 rounded-3xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-50">
          <!-- Campo de búsqueda por texto -->
          <input id="search-tasks" type="text" placeholder="Buscar por título o descripción..." class="min-w-0 flex-1 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />

          <!-- Selector de filtro por estado -->
          <select id="filter-status" class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none">
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>

          <!-- Selector de criterio de ordenamiento -->
          <select id="sort-tasks" class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none">
            <option value="createdAt">Más recientes</option>
            <option value="dueDate">Por vencimiento</option>
            <option value="title">Alfabético</option>
          </select>

          <!-- Botón para alternar entre vista lista y vista kanban -->
          <button id="toggle-kanban" class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Vista kanban</button>
        </div>

        <!-- Contenedor para la vista de lista (paginada) -->
        <div id="tasks-list" class="grid gap-4"></div>

        <!-- Contenedor para la vista kanban (oculto por defecto) -->
        <div id="kanban-board" class="hidden grid-cols-1 gap-4 md:grid-cols-3"></div>

        <!-- Contenedor para los botones de paginación -->
        <div id="pagination" class="flex items-center justify-center gap-3"></div>
      </section>
    `;
  },
  // afterRender: configura los event listeners de búsqueda, filtro, ordenamiento y toggle kanban,
  // y carga inicial de la lista de tareas
  afterRender: () => {
    // Obtiene el usuario autenticado
    const user = getCurrentUser();
    // Almacena todas las tareas cargadas para aplicar filtros sin recargar del servidor
    let allTasks = [];

    // Indica si la vista actual es kanban (true) o lista (false)
    let isKanban = false;
    // Referencia al botón que alterna entre vista lista y kanban
    const kanbanToggle = document.getElementById("toggle-kanban");

    // renderBoard: carga tareas y renderiza el tablero kanban
    const renderBoard = async () => {
      allTasks = await fetchTasks(user);
      renderKanban(allTasks);
    };

    // loadList: carga tareas y renderiza la vista de lista con paginación
    const loadList = async () => {
      allTasks = await fetchTasks(user);
      applyUI(allTasks, user);
    };

    // switchToList: cambia de vista kanban a vista lista, mostrando el contenedor de lista y ocultando kanban
    const switchToList = () => {
      isKanban = false;
      kanbanToggle.textContent = "Vista kanban";
      document.getElementById("tasks-list")?.classList.remove("hidden");
      document.getElementById("kanban-board")?.classList.add("hidden");
      document.getElementById("filter-status").disabled = false;
      applyUI(allTasks, user);
    };

    // switchToKanban: cambia de vista lista a vista kanban, ocultando la lista y mostrando el tablero
    const switchToKanban = async () => {
      isKanban = true;
      kanbanToggle.textContent = "Vista lista";
      document.getElementById("filter-status").disabled = true;
      await renderBoard();
    };

    // Listener del botón de toggle: alterna entre lista y kanban
    if (kanbanToggle) {
      kanbanToggle.addEventListener("click", () => {
        if (isKanban) switchToList();
        else switchToKanban();
      });
    }

    // Carga inicial de la lista de tareas
    loadList();

    // Listener de búsqueda: filtra en tiempo real y reinicia la paginación
    document.getElementById("search-tasks")?.addEventListener("input", () => {
      sessionStorage.setItem("tasks_page", "1");
      if (isKanban) renderBoard();
      else applyUI(allTasks, user);
    });
    // Listener de filtro por estado: reinicia la paginación y aplica el filtro
    document.getElementById("filter-status")?.addEventListener("change", () => {
      sessionStorage.setItem("tasks_page", "1");
      applyUI(allTasks, user);
    });
    // Listener de ordenamiento: reinicia la paginación y reordena las tareas
    document.getElementById("sort-tasks")?.addEventListener("change", () => {
      sessionStorage.setItem("tasks_page", "1");
      if (isKanban) renderBoard();
      else applyUI(allTasks, user);
    });
  },
};
