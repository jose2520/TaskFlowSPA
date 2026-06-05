// Vista de formulario de tarea (crear/editar)
// Permite crear una tarea nueva o editar una existente, con sección de comentarios en modo edición.

// Importa servicios de tareas para crear, obtener y actualizar tareas
import { createTask, getTaskById, updateTask } from "../services/taskService.js";
// Importa servicios de autenticación para conocer el usuario actual y verificar si es admin
import { getCurrentUser, isAdmin } from "../services/authService.js";
// Importa utilidades de DOM para navegación y escape de HTML
import { goTo, escapeHtml } from "../utils/dom.js";
// Importa utilidad de notificaciones toast
import { showToast } from "../utils/toast.js";
// Importa componentes de comentarios para cargar y enviar comentarios en edición
import { loadComments, initCommentForm } from "../components/comments.js";

export default {
  // Título de la página
  title: "Tarea",

  // render: genera el HTML del formulario de tarea (creación o edición) y la sección de comentarios si aplica
  // @param {Object} params - Parámetros de la ruta, puede contener id para modo edición
  // @returns {string} HTML del formulario o mensaje de error si no hay permisos
  render: async ({ params }) => {
    // Obtiene el usuario autenticado
    const currentUser = getCurrentUser();
    // Determina si es modo edición según la presencia de id en los parámetros
    const isEdit = Boolean(params?.id);
    // Si es edición, obtiene la tarea existente por su id
    const existingTask = isEdit ? await getTaskById(params.id) : null;

    // Si se esperaba una tarea y no se encontró, muestra mensaje de error
    if (isEdit && !existingTask) {
      return `<div class="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-50"><p class="text-slate-700">Tarea no encontrada.</p></div>`;
    }

    // Verifica permisos: solo el propietario o un admin pueden editar
    const isOwner = existingTask?.ownerId === currentUser?.id;
    const canEdit = !isEdit || isAdmin() || isOwner;
    if (!canEdit) {
      return `<div class="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-50"><p class="text-slate-700">No tienes permiso para editar esta tarea.</p></div>`;
    }

    return `
      <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
        <!-- Encabezado del formulario -->
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Formulario</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900">${isEdit ? "Editar tarea" : "Crear tarea"}</h1>
        <p class="mt-4 max-w-2xl text-slate-600">Vista base para registrar una tarea nueva o actualizar una existente.</p>

        <!-- Formulario principal de la tarea -->
        <form id="task-form" class="mt-8 grid gap-5">
          <!-- Campo de título -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="title">T&iacute;tulo</label>
            <input id="title" name="title" type="text" required value="${escapeHtml(existingTask?.title || "")}" placeholder="Ej. Preparar proyecto final" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
          </div>

          <!-- Campo de descripción -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="description">Descripci&oacute;n</label>
            <textarea id="description" name="description" rows="5" required placeholder="Describe la tarea..." class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none">${escapeHtml(existingTask?.description || "")}</textarea>
          </div>

          <!-- Campos de estado y fecha límite en fila -->
          <div class="grid gap-5 md:grid-cols-2">
            <!-- Selector de estado (pendiente, en progreso, completada) -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="status">Estado</label>
              <select id="status" name="status" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none">
                <option value="pending" ${existingTask?.status === "pending" ? "selected" : ""}>Pendiente</option>
                <option value="in-progress" ${existingTask?.status === "in-progress" ? "selected" : ""}>En progreso</option>
                <option value="completed" ${existingTask?.status === "completed" ? "selected" : ""}>Completada</option>
              </select>
            </div>
            <!-- Campo de fecha límite -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="dueDate">Fecha l&iacute;mite</label>
              <input id="dueDate" name="dueDate" type="date" value="${escapeHtml(existingTask?.dueDate || "")}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
          </div>

          <!-- Mensaje de error dinámico -->
          <p id="task-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
          <!-- Botones de acción: guardar y cancelar -->
          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button id="task-save" type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">${isEdit ? "Guardar cambios" : "Guardar tarea"}</button>
            <a data-link href="/tasks" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Cancelar</a>
          </div>
        </form>

        <!-- Sección de comentarios solo visible en modo edición -->
        ${isEdit ? `
          <section class="mt-10 border-t border-blue-100 pt-8">
            <h2 class="text-xl font-bold text-slate-900">Comentarios</h2>
            <!-- Contenedor donde se renderiza la lista de comentarios -->
            <div id="comments-list" class="mt-4 space-y-3"></div>
            <!-- Formulario para agregar un nuevo comentario -->
            <form id="comment-form" class="mt-4 flex gap-3">
              <input id="comment-input" type="text" placeholder="Escribe un comentario..." required class="min-w-0 flex-1 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
              <button type="submit" class="shrink-0 rounded-2xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-500">Enviar</button>
            </form>
          </section>
        ` : ""}
      </section>
    `;
  },
  // afterRender: configura el listener del formulario de tarea y carga los comentarios si es edición
  afterRender: ({ params }) => {
    // Referencias a elementos del DOM
    const form = document.querySelector("#task-form");
    const errorMessage = document.querySelector("#task-error");
    const saveButton = document.querySelector("#task-save");
    if (!form || !errorMessage || !saveButton) return;

    // Si es modo edición, carga los comentarios existentes e inicializa el formulario de comentarios
    if (params?.id) {
      loadComments(params.id);
      initCommentForm(params.id);
    }

    // Listener del formulario: crea o actualiza la tarea según el modo
    form.addEventListener("submit", async (event) => {
      // Evita la recarga de la página
      event.preventDefault();
      // Limpia mensajes de error anteriores y deshabilita el botón
      errorMessage.textContent = "";
      saveButton.disabled = true;
      saveButton.textContent = "Guardando...";
      // Obtiene los valores del formulario
      const formData = new FormData(form);
      const title = formData.get("title").toString().trim();
      const description = formData.get("description").toString().trim();
      const status = formData.get("status").toString();
      const dueDate = formData.get("dueDate").toString();
      const currentUser = getCurrentUser();

      // Valida que los campos obligatorios no estén vacíos
      if (!title || !description) {
        errorMessage.textContent = "Todos los campos son obligatorios.";
        saveButton.disabled = false;
        saveButton.textContent = params?.id ? "Guardar cambios" : "Guardar tarea";
        return;
      }

      try {
        if (params?.id) {
          // Modo edición: actualiza la tarea existente
          const updated = await updateTask(params.id, { title, description, status, dueDate });
          if (!updated) {
            errorMessage.textContent = "No se pudo actualizar la tarea.";
            saveButton.disabled = false;
            saveButton.textContent = "Guardar cambios";
            return;
          }
          showToast("Tarea actualizada correctamente", "success");
        } else {
          // Modo creación: crea una nueva tarea
          await createTask({ ownerId: currentUser.id, title, description, status, dueDate });
          showToast("Tarea creada correctamente", "success");
        }
        // Redirige al listado de tareas
        goTo("/tasks");
      } catch (error) {
        errorMessage.textContent = error.message || "Error al guardar la tarea.";
        saveButton.disabled = false;
        saveButton.textContent = params?.id ? "Guardar cambios" : "Guardar tarea";
      }
    });
  },
};
