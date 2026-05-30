import { getCurrentUser, updateProfile, deleteAccount } from "../services/authService.js";
import { deleteTasksForUser } from "../services/taskService.js";
import { goTo, escapeHtml } from "../utils/dom.js";

export default {
  title: "Perfil",
  render: async () => {
    const user = getCurrentUser();
    if (!user) {
      return `<div class="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-50"><p class="text-slate-700">No se ha encontrado el usuario.</p></div>`;
    }

    return `
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="rounded-[2rem] bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </aside>

        <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
          <form id="profile-form" class="grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="name">Nombre</label>
              <input id="name" name="name" type="text" required value="${escapeHtml(user.name)}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="email">Correo</label>
              <input id="email" name="email" type="email" required value="${escapeHtml(user.email)}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password">Nueva contrase&ntilde;a</label>
              <input id="password" name="password" type="password" placeholder="Deja en blanco para mantenerla" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <p id="profile-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <button id="profile-save" type="submit" class="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Guardar cambios</button>
              <button id="delete-account" type="button" class="inline-flex w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-rose-700 hover:bg-rose-50">Eliminar mi cuenta</button>
            </div>
          </form>
        </section>
      </section>
    `;
  },
  afterRender: () => {
    const form = document.querySelector("#profile-form");
    const errorMessage = document.querySelector("#profile-error");
    const saveButton = document.querySelector("#profile-save");
    const deleteButton = document.querySelector("#delete-account");
    const user = getCurrentUser();

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorMessage.textContent = "";
        saveButton.disabled = true;
        saveButton.textContent = "Guardando...";
        const formData = new FormData(form);
        const name = formData.get("name").toString().trim();
        const email = formData.get("email").toString().trim();
        const password = formData.get("password").toString();

        try {
          const result = await updateProfile({ id: user.id, name, email, password: password || undefined });
          if (result.error) {
            errorMessage.textContent = result.error;
            saveButton.disabled = false;
            saveButton.textContent = "Guardar cambios";
            return;
          }
          goTo("/profile");
        } catch (error) {
          errorMessage.textContent = error.message || "Error al actualizar perfil.";
          saveButton.disabled = false;
          saveButton.textContent = "Guardar cambios";
        }
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", async () => {
        const confirmed = window.confirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmed) return;
        deleteButton.disabled = true;
        deleteButton.textContent = "Eliminando...";
        try {
          await deleteTasksForUser(user.id);
          await deleteAccount(user.id);
          goTo("/login");
        } catch (error) {
          errorMessage.textContent = error.message || "Error al eliminar la cuenta.";
          deleteButton.disabled = false;
          deleteButton.textContent = "Eliminar mi cuenta";
        }
      });
    }
  },
};
