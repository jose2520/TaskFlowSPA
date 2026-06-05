// Vista de perfil de usuario
// Permite al usuario autenticado ver y editar su información personal, así como eliminar su cuenta.

// Importa servicios de autenticación para obtener el usuario actual, actualizar perfil y eliminar cuenta
import { getCurrentUser, updateProfile, deleteAccount } from "../services/authService.js";
// Importa servicio de tareas para eliminar las tareas asociadas al usuario
import { deleteTasksForUser } from "../services/taskService.js";
// Importa utilidades de DOM para navegación y escape de HTML
import { goTo, escapeHtml } from "../utils/dom.js";
// Importa utilidades de notificaciones y confirmación modal
import { showToast, showConfirm } from "../utils/toast.js";

export default {
  // Título de la página
  title: "Perfil",

  // render: genera el HTML del perfil con formulario de edición y botón de eliminar cuenta
  // @returns {string} HTML del perfil o mensaje de error si no hay usuario
  render: async () => {
    // Obtiene el usuario autenticado desde el servicio de sesión
    const user = getCurrentUser();
    // Si no hay usuario, muestra un mensaje de error
    if (!user) {
      return `<div class="rounded-[2rem] bg-white p-8 shadow-lg shadow-blue-50"><p class="text-slate-700">No se ha encontrado el usuario.</p></div>`;
    }

    return `
      <!-- Sección principal con diseño de dos columnas: panel lateral y formulario -->
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

        <!-- Panel lateral con información y descripción del perfil -->
        <aside class="rounded-[2rem] bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </aside>

        <!-- Formulario de edición de perfil -->
        <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
          <form id="profile-form" class="grid gap-5">
            <!-- Campo de nombre -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="name">Nombre</label>
              <input id="name" name="name" type="text" required value="${escapeHtml(user.name)}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <!-- Campo de correo electrónico -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="email">Correo</label>
              <input id="email" name="email" type="email" required value="${escapeHtml(user.email)}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <!-- Campo opcional de nueva contraseña (vacío = mantener la actual) -->
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password">Nueva contrase&ntilde;a</label>
              <input id="password" name="password" type="password" placeholder="Deja en blanco para mantenerla" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <!-- Mensaje de error dinámico -->
            <p id="profile-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
            <!-- Botones de acción: guardar cambios y eliminar cuenta -->
            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <button id="profile-save" type="submit" class="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Guardar cambios</button>
              <button id="delete-account" type="button" class="inline-flex w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-bold text-rose-700 hover:bg-rose-50">Eliminar mi cuenta</button>
            </div>
          </form>
        </section>
      </section>
    `;
  },
  // afterRender: configura los event listeners del formulario de perfil y del botón de eliminar cuenta
  afterRender: () => {
    // Referencias a elementos del DOM
    const form = document.querySelector("#profile-form");
    const errorMessage = document.querySelector("#profile-error");
    const saveButton = document.querySelector("#profile-save");
    const deleteButton = document.querySelector("#delete-account");
    const user = getCurrentUser();

    // Listener del formulario: envía los datos actualizados al servicio de autenticación
    if (form) {
      form.addEventListener("submit", async (event) => {
        // Evita la recarga de la página
        event.preventDefault();
        // Limpia mensajes de error anteriores y deshabilita el botón
        errorMessage.textContent = "";
        saveButton.disabled = true;
        saveButton.textContent = "Guardando...";
        // Obtiene los valores del formulario
        const formData = new FormData(form);
        const name = formData.get("name").toString().trim();
        const email = formData.get("email").toString().trim();
        const password = formData.get("password").toString();

        try {
          // Llama al servicio para actualizar el perfil
          const result = await updateProfile({ id: user.id, name, email, password: password || undefined });
          if (result.error) {
            showToast(result.error, "error");
            saveButton.disabled = false;
            saveButton.textContent = "Guardar cambios";
            return;
          }
          showToast("Perfil actualizado correctamente", "success");
          // Recarga la vista de perfil
          goTo("/profile");
        } catch (error) {
          errorMessage.textContent = error.message || "Error al actualizar perfil.";
          saveButton.disabled = false;
          saveButton.textContent = "Guardar cambios";
        }
      });
    }

    // Listener del botón de eliminar cuenta: pide confirmación y elimina al usuario y sus tareas
    if (deleteButton) {
      deleteButton.addEventListener("click", async () => {
        // Muestra un modal de confirmación
        const confirmed = await showConfirm("¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmed) return;
        deleteButton.disabled = true;
        deleteButton.textContent = "Eliminando...";
        try {
          // Elimina primero las tareas del usuario y luego la cuenta
          await deleteTasksForUser(user.id);
          await deleteAccount(user.id);
          showToast("Cuenta eliminada. Serás redirigido.", "info");
          // Redirige al login después de 1.5 segundos
          setTimeout(() => goTo("/login"), 1500);
        } catch (error) {
          showToast(error.message || "Error al eliminar la cuenta", "error");
          deleteButton.disabled = false;
          deleteButton.textContent = "Eliminar mi cuenta";
        }
      });
    }
  },
};
