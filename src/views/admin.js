import { getAllUsers, changeUserRole, deleteAccount, getCurrentUser } from "../services/authService.js";
import { getTasks, deleteTasksForUser } from "../services/taskService.js";
import { escapeHtml } from "../utils/dom.js";

const renderUserCard = (user, currentUser) => {
  const isCurrent = user.id === currentUser.id;
  return `
    <div class="rounded-2xl bg-blue-50 p-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="font-bold text-slate-900">${escapeHtml(user.name)}</p>
          <p class="text-sm text-slate-500">${escapeHtml(user.email)}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-700">${user.role}</span>
          ${!isCurrent ? `<button data-action="toggle-role" data-id="${user.id}" class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-white">Cambiar rol</button>` : ""}
          ${!isCurrent ? `<button data-action="delete-user" data-id="${user.id}" class="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Eliminar</button>` : ""}
        </div>
      </div>
    </div>
  `;
};

export default {
  title: "Admin",
  render: async () => {
    const currentUser = getCurrentUser();
    const users = await getAllUsers();
    const tasks = await getTasks({ includeAll: true });

    return `
      <section class="grid gap-6">
        <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Rol administrador</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
          <p class="mt-4 max-w-2xl text-blue-50">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
        </section>

        <section class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <h2 class="text-xl font-bold text-slate-900">Acciones r&aacute;pidas</h2>
            <div class="mt-5 grid gap-4">
              <a data-link href="/admin" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">Gestionar usuarios</a>
              <a data-link href="/tasks" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">Ver todas las tareas</a>
              <a data-link href="/dashboard" class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">Volver al dashboard</a>
            </div>
          </article>

          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-900">Usuarios</h2>
              <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Mockup</span>
            </div>
            <div class="mt-5 space-y-4">
              ${users.map((user) => renderUserCard(user, currentUser)).join("")}
            </div>
          </article>
        </section>
      </section>
    `;
  },
  afterRender: () => {
    document.querySelectorAll("button[data-action='toggle-role']").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const userId = button.dataset.id;
          const allUsers = await getAllUsers();
          const user = allUsers.find((item) => item.id === userId);
          if (!user) return;
          const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
          await changeUserRole(userId, nextRole);
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (error) {
          alert(error.message || "Error al cambiar el rol.");
        }
      });
    });

    document.querySelectorAll("button[data-action='delete-user']").forEach((button) => {
      button.addEventListener("click", async () => {
        const userId = button.dataset.id;
        const confirmed = window.confirm("¿Eliminar este usuario y sus tareas?");
        if (!confirmed) return;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = "Eliminando...";
        try {
          await deleteTasksForUser(userId);
          await deleteAccount(userId);
          window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (error) {
          alert(error.message || "Error al eliminar el usuario.");
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });
  },
};
