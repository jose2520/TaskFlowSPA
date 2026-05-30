import { createTask, getTaskById, updateTask } from "../services/taskService.js";
import { getCurrentUser, isAdmin } from "../services/authService.js";
import { goTo, escapeHtml } from "../utils/dom.js";

export default {
  title: "Tarea",
  render: async ({ params }) => {
    const currentUser = getCurrentUser();
    const isEdit = Boolean(params?.id);
    const existingTask = isEdit ? await getTaskById(params.id) : null;

    if (isEdit && !existingTask) {
      return `<div class="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-50"><p class="text-slate-700">Tarea no encontrada.</p></div>`;
    }

    const isOwner = existingTask?.ownerId === currentUser?.id;
    const canEdit = !isEdit || isAdmin() || isOwner;
    if (!canEdit) {
      return `<div class="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-50"><p class="text-slate-700">No tienes permiso para editar esta tarea.</p></div>`;
    }

    return `
      <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Formulario</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900">${isEdit ? "Editar tarea" : "Crear tarea"}</h1>
        <p class="mt-4 max-w-2xl text-slate-600">Vista base para registrar una tarea nueva o actualizar una existente.</p>

        <form id="task-form" class="mt-8 grid gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="title">T&iacute;tulo</label>
            <input id="title" name="title" type="text" required value="${escapeHtml(existingTask?.title || "")}" placeholder="Ej. Preparar proyecto final" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="description">Descripci&oacute;n</label>
            <textarea id="description" name="description" rows="5" required placeholder="Describe la tarea..." class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none">${escapeHtml(existingTask?.description || "")}</textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="status">Estado</label>
              <select id="status" name="status" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none">
                <option value="pending" ${existingTask?.status === "pending" ? "selected" : ""}>Pendiente</option>
                <option value="in-progress" ${existingTask?.status === "in-progress" ? "selected" : ""}>En progreso</option>
                <option value="completed" ${existingTask?.status === "completed" ? "selected" : ""}>Completada</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="dueDate">Fecha l&iacute;mite</label>
              <input id="dueDate" name="dueDate" type="date" value="${escapeHtml(existingTask?.dueDate || "")}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
          </div>

          <p id="task-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button id="task-save" type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">${isEdit ? "Guardar cambios" : "Guardar tarea"}</button>
            <a data-link href="/tasks" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Cancelar</a>
          </div>
        </form>
      </section>
    `;
  },
  afterRender: ({ params }) => {
    const form = document.querySelector("#task-form");
    const errorMessage = document.querySelector("#task-error");
    const saveButton = document.querySelector("#task-save");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      errorMessage.textContent = "";
      saveButton.disabled = true;
      saveButton.textContent = "Guardando...";
      const formData = new FormData(form);
      const title = formData.get("title").toString().trim();
      const description = formData.get("description").toString().trim();
      const status = formData.get("status").toString();
      const dueDate = formData.get("dueDate").toString();
      const currentUser = getCurrentUser();

      if (!title || !description) {
        errorMessage.textContent = "Todos los campos son obligatorios.";
        saveButton.disabled = false;
        saveButton.textContent = params?.id ? "Guardar cambios" : "Guardar tarea";
        return;
      }

      try {
        if (params?.id) {
          const updated = await updateTask(params.id, { title, description, status, dueDate });
          if (!updated) {
            errorMessage.textContent = "No se pudo actualizar la tarea.";
            saveButton.disabled = false;
            saveButton.textContent = "Guardar cambios";
            return;
          }
        } else {
          await createTask({ ownerId: currentUser.id, title, description, status, dueDate });
        }
        goTo("/tasks");
      } catch (error) {
        errorMessage.textContent = error.message || "Error al guardar la tarea.";
        saveButton.disabled = false;
        saveButton.textContent = params?.id ? "Guardar cambios" : "Guardar tarea";
      }
    });
  },
};
