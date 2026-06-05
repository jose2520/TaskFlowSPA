// Vista de recuperación de contraseña
// Permite solicitar un enlace de restablecimiento (simulado) y establecer una nueva contraseña mediante token.

// Importa el cliente de API para consultar y actualizar usuarios en el backend fake
import { api } from "../services/api.js";
// Importa utilidades de DOM para navegación y escape de HTML
import { goTo, escapeHtml } from "../utils/dom.js";
// Importa utilidad de notificaciones toast
import { showToast } from "../utils/toast.js";
// Importa función de cifrado para almacenar la contraseña de forma segura
import { encrypt } from "../utils/crypto.js";
// Importa utilidades de almacenamiento local para persistir el token de recuperación
import { setLocalData, getLocalData, removeLocalData } from "../services/storage.js";

// Clave usada en localStorage para guardar el token de recuperación y el email asociado
const TOKEN_KEY = "taskflowspa_recovery";

export default {
  // Título de la página
  title: "Recuperar contraseña",

  // render: genera el HTML según si hay un token de restablecimiento o se muestra el formulario de solicitud
  // @param {Object} params - Parámetros de la ruta, puede contener token
  // @returns {string} HTML del formulario de solicitud o del formulario de nueva contraseña
  render: async ({ params }) => {
    // Extrae el token de los parámetros de la ruta
    const token = params?.token;

    // Si hay token, muestra el formulario para ingresar la nueva contraseña
    if (token) {
      // Verifica que el token exista en localStorage y coincida
      const stored = getLocalData(TOKEN_KEY);
      if (!stored || stored.token !== token) {
        // Token inválido o expirado, muestra mensaje de error con enlace para solicitar uno nuevo
        return `
          <section class="grid min-h-[70vh] place-items-center">
            <div class="w-full max-w-md rounded-[2rem] border border-blue-100 bg-white p-8 shadow-lg shadow-blue-50 text-center">
              <p class="text-lg font-bold text-rose-600">Enlace inválido o expirado</p>
              <a data-link href="/recovery" class="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">Solicitar nuevo enlace</a>
            </div>
          </section>
        `;
      }

      // Token válido: muestra formulario para escribir la nueva contraseña
      return `
        <section class="grid min-h-[70vh] place-items-center">
          <div class="w-full max-w-md">
            <div class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-lg shadow-blue-50">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Nueva contraseña</p>
              <h1 class="mt-3 text-3xl font-black text-slate-900">Restablecer contraseña</h1>
              <!-- Muestra el email del usuario que solicitó la recuperación -->
              <p class="mt-2 text-sm text-slate-600">Ingresa tu nueva contraseña para ${escapeHtml(stored.email)}</p>
              <form id="reset-form" class="mt-6 grid gap-5">
                <!-- Campo para la nueva contraseña -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700" for="new-password">Nueva contraseña</label>
                  <input id="new-password" name="password" type="password" required minlength="4" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
                </div>
                <!-- Mensaje de error dinámico -->
                <p id="reset-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
                <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Guardar nueva contraseña</button>
              </form>
            </div>
          </div>
        </section>
      `;
    }

    // Sin token: muestra el formulario para solicitar el enlace de recuperación
    return `
      <section class="grid min-h-[70vh] place-items-center">
        <div class="w-full max-w-md">
          <div class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-lg shadow-blue-50">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Recuperación</p>
            <h1 class="mt-3 text-3xl font-black text-slate-900">¿Olvidaste tu contraseña?</h1>
            <p class="mt-2 text-sm text-slate-600">Ingresa tu correo y recibirás un enlace para restablecerla.</p>
            <form id="recovery-form" class="mt-6 grid gap-5">
              <!-- Campo para ingresar el correo electrónico -->
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700" for="recovery-email">Correo electrónico</label>
                <input id="recovery-email" name="email" type="email" required class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
              </div>
              <!-- Mensaje de error dinámico -->
              <p id="recovery-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
              <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Enviar enlace</button>
            </form>
            <!-- Enlace para volver al inicio de sesión -->
            <p class="mt-4 text-center text-sm text-slate-500">
              <a data-link href="/login" class="font-semibold text-blue-700 hover:underline">Volver al inicio de sesión</a>
            </p>
          </div>
        </div>
      </section>
    `;
  },
  // afterRender: configura los event listeners según si hay token (restablecer) o no (solicitar enlace)
  afterRender: ({ params }) => {
    // Extrae el token de los parámetros de la ruta
    const token = params?.token;

    // Si hay token, configura el formulario de restablecimiento de contraseña
    if (token) {
      const form = document.getElementById("reset-form");
      const errorEl = document.getElementById("reset-error");
      const stored = getLocalData(TOKEN_KEY);
      if (!form || !stored) return;

      // Listener del formulario de nueva contraseña
      form.addEventListener("submit", async (e) => {
        // Evita la recarga de la página
        e.preventDefault();
        // Valida que la contraseña tenga al menos 4 caracteres
        const password = form.querySelector("[name='password']").value.trim();
        if (!password || password.length < 4) {
          errorEl.textContent = "La contraseña debe tener al menos 4 caracteres.";
          return;
        }

        try {
          // Busca al usuario por email en el backend
          const users = await api.get(`/users?email=${encodeURIComponent(stored.email.toLowerCase())}`);
          if (users.length === 0) {
            errorEl.textContent = "Usuario no encontrado.";
            return;
          }
          // Actualiza la contraseña cifrada en el backend
          await api.patch(`/users/${users[0].id}`, { password: encrypt(password) });
          // Limpia el token de recuperación usado
          removeLocalData(TOKEN_KEY);
          showToast("Contraseña actualizada. Inicia sesión.", "success");
          goTo("/login");
        } catch (err) {
          errorEl.textContent = err.message || "Error al restablecer la contraseña.";
        }
      });
      return;
    }

    // Sin token: configura el formulario de solicitud de enlace de recuperación
    const form = document.getElementById("recovery-form");
    const errorEl = document.getElementById("recovery-error");
    if (!form) return;

    // Listener del formulario de solicitud de recuperación
    form.addEventListener("submit", async (e) => {
      // Evita la recarga de la página
      e.preventDefault();
      const email = form.querySelector("[name='email']").value.trim();
      if (!email) {
        errorEl.textContent = "Ingresa un correo válido.";
        return;
      }

      try {
        // Verifica que exista un usuario con ese correo
        const users = await api.get(`/users?email=${encodeURIComponent(email.toLowerCase())}`);
        if (users.length === 0) {
          errorEl.textContent = "No encontramos una cuenta con ese correo.";
          return;
        }

        // Genera un token único y lo guarda en localStorage junto con el email
        const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
        setLocalData(TOKEN_KEY, { email: email.toLowerCase(), token });

        // Muestra el enlace de recuperación simulado en consola
        showToast("Enlace de recuperación generado (simulado). Revisa la consola.", "info");
        const resetLink = `${window.location.origin}/recovery/${token}`;
        console.log(`%c[TaskFlowSPA] Enlace de recuperación:\n${resetLink}`, "color: #2563eb; font-size: 14px;");
        errorEl.innerHTML = `<span class="text-emerald-600">Enlace generado. Revisa la consola del navegador (F12) para verlo.</span>`;
      } catch (err) {
        errorEl.textContent = err.message || "Error al procesar la solicitud.";
      }
    });
  },
};
