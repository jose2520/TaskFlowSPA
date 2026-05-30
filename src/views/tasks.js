import { getTasks, deleteTask } from "../services/taskService.js";
import { getCurrentUser, isAdmin } from "../services/authService.js";
import { goTo, escapeHtml } from "../utils/dom.js";

const renderTaskCard = (task, currentUser) => {
  const canEdit = isAdmin() || task.ownerId === currentUser.id;
  const statusBadge = {
    pending: "bg-amber-100 text-amber-700",
    "in-progress": "bg-sky-100 text-sky-700",
    completed: "bg-emerald-100 text-emerald-700",
  }[task.status] || "bg-slate-100 text-slate-700";

  return `
    <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status.replace("-", " ")}</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">${escapeHtml(task.title)}</h2>
          <p class="mt-3 text-slate-600">${escapeHtml(task.description)}</p>
          <p class="mt-4 text-sm text-slate-500">Creado el ${escapeHtml(task.createdAt)}</p>
          ${task.dueDate ? `<p class="mt-2 text-sm text-slate-500">Vence el ${escapeHtml(task.dueDate)}</p>` : ""}
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full px-3 py-1 text-sm font-semibold ${statusBadge}">${task.status.replace("-", " ")}</span>
          ${canEdit ? `<button data-action="edit" data-id="${task.id}" class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Editar</button>` : ""}
          ${canEdit ? `<button data-action="delete" data-id="${task.id}" class="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Eliminar</button>` : ""}
        </div>
      </div>
    </article>
  `;
};

export default {
  title: "Tareas",
  render: async () => {
    const user = getCurrentUser();
    const tasks = await getTasks({ userId: user.id, includeAll: isAdmin() });

    return `
      <section class="grid gap-4">
        <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">CRUD de tareas</p>
          <h1 class="mt-4 text-4xl font-black tracking-tight">Mis tareas</h1>
          <p class="mt-4 max-w-2xl text-blue-100">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
          <a data-link href="/tasks/create" class="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50">Crear tarea</a>
        </section>

        <section class="grid gap-4">
          ${tasks.length === 0 ? `<div class="rounded-[2rem] bg-white p-8 text-center shadow-lg shadow-blue-50"><p class="text-slate-700">No hay tareas todav&iacute;a. Crea la primera tarea para comenzar.</p></div>` : tasks.map((task) => renderTaskCard(task, user)).join("")}
        </section>
      </section>
    `;
  },
  afterRender: () => {
    document.querySelectorAll("button[data-action='edit']").forEach((button) => {
      button.addEventListener("click", () => {
        const taskId = button.dataset.id;
        goTo(`/tasks/edit/${taskId}`);
      });
    });

    document.querySelectorAll("button[data-action='delete']").forEach((button) => {
      button.addEventListener("click", async () => {
        const taskId = button.dataset.id;
        const confirmed = window.confirm("¿Eliminar esta tarea?");
        if (!confirmed) return;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = "Eliminando...";
        try {
          await deleteTask(taskId);
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (error) {
          alert(error.message || "Error al eliminar la tarea.");
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });
  },
};
