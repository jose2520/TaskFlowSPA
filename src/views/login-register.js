/*
 * Vista combinada de inicio de sesión y registro.
 * Renderiza un diseño de panel deslizante (overlay) con formularios
 * de login y registro, toggle de visibilidad de contraseña, indicador
 * de fortaleza de contraseña y confirmación en tiempo real.
 */

// Servicio de autenticación: funciones login y register
import { login, register } from "../services/authService.js";
// Utilidad DOM: navegación programática y toggle de visibilidad de contraseña
import { goTo, togglePasswordVisibility } from "../utils/dom.js";
// Utilidad de tema: obtener tema actual y alternar modo oscuro
import { getTheme, toggleTheme } from "../utils/theme.js";
// Utilidad de contraseña: obtener fortaleza y actualizar indicador visual
import { getPasswordStrength, updatePasswordStrength } from "../utils/password.js";

export default {
  title: "Login",
  // render: construye el HTML con formularios de login y registro en panel overlay
  render: async ({ currentPath }) => {
    const isRegister = currentPath === "/register";
    document.title = isRegister ? "Registro | TaskFlowSPA" : "Iniciar sesión | TaskFlowSPA";
    const themeIcon = getTheme() === "dark" ? "☀️" : "🌙";

    return `
    <div id="auth-container" class="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 text-slate-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-slate-100 ${isRegister ? "right-panel-active" : ""}">

      <main class="relative grid min-h-screen overflow-hidden lg:grid-cols-[1fr_0.95fr]">

            <!-- ========== FONDO: LOGIN ========== -->

            <!-- Login form (izquierda) -->
            <!-- Formulario de inicio de sesión (lado izquierdo) -->
            <section class="sign-in-container flex items-center justify-center px-6 py-10">
              <div class="w-full max-w-xl">
                <div class="flex items-center justify-between">
                  <a data-link class="text-xl font-black tracking-tight text-blue-900 dark:text-blue-300" href="/">TaskFlowSPA</a>
                  <div class="flex items-center gap-2">
                    <button id="theme-toggle-login" type="button" class="cursor-pointer rounded-full bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">${themeIcon}</button>
                    <button id="signUp" type="button" class="cursor-pointer rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-slate-600 dark:text-blue-300 dark:hover:bg-slate-700">Registrarse</button>
                  </div>
                </div>
                <div class="mt-8">
                  <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Inicio de sesi&oacute;n</p>
                  <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Bienvenido de nuevo</h1>
                  <p class="mt-4 text-slate-600 dark:text-slate-400">Ingresa a tu espacio de trabajo y contin&uacute;a organizando tus tareas.</p>
                </div>
                <form id="login-form" class="mt-8 grid gap-5">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="login-email">Correo</label>
                    <input id="login-email" name="email" type="email" required placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400" />
                  </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="login-password">Contrase&ntilde;a</label>
                      <div class="relative">
                        <input id="login-password" name="password" type="password" required placeholder="Ingresa tu contrase&ntilde;a" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400" />
                        <button id="toggle-login-password" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" tabindex="-1">
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                      </div>
                    </div>
                  <p id="login-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
                  <button id="login-submit" type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Entrar al dashboard</button>
                </form>
              </div>
            </section>

            <!-- Login promo (derecha) -->
            <!-- Panel promocional de login (lado derecho, solo desktop) -->
            <section class="info-panel hidden flex-col justify-center bg-blue-600 p-10 text-white lg:flex">
              <div class="mx-auto max-w-lg">
                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">TaskFlowSPA</p>
                <h2 class="mt-4 text-5xl font-black tracking-tight">Una experiencia limpia para aprender una primera SPA.</h2>
                <ul class="mt-8 space-y-4 text-lg leading-8 text-blue-50">
                  <li>Autenticaci&oacute;n simplificada con localStorage.</li>
                  <li>Gesti&oacute;n de tareas con enfoque claro y visual.</li>
                  <li>Roles y permisos entendibles desde el primer recorrido.</li>
                </ul>
              </div>
            </section>

            <!-- ========== OVERLAY: REGISTRO (absoluto, cubre todo) ========== -->
            <!-- Overlay de registro: cubre toda la pantalla sobre el login -->
            <section class="sign-up-container absolute inset-0 z-20 grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">

              <!-- Register promo (izquierda del overlay) -->
              <!-- Panel promocional de registro (lado izquierdo del overlay) -->
              <section class="register-info-panel hidden flex-col justify-between bg-blue-600 p-10 text-white lg:flex">
                <a data-link class="text-xl font-black tracking-tight" href="/">TaskFlowSPA</a>
                <div>
                  <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Nuevo usuario</p>
                  <h1 class="mt-4 text-5xl font-black tracking-tight">Crea tu cuenta y empieza a organizar tu flujo.</h1>
                  <p class="mt-5 max-w-md text-lg leading-8 text-blue-50">Reg&iacute;strate para acceder al proyecto con el dise&ntilde;o original de registro y control de acceso.</p>
                </div>
                <p class="text-sm text-blue-200">Interfaz base del m&oacute;dulo de autenticaci&oacute;n.</p>
              </section>

              <!-- Register form (derecha del overlay) -->
              <!-- Formulario de registro (lado derecho del overlay) -->
              <section class="info-panel2 flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-blue-100 px-6 py-10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div class="w-full max-w-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Registro</p>
                      <h2 class="mt-2 text-3xl font-black text-slate-900 dark:text-white">Crear cuenta</h2>
                    </div>
                    <div class="flex items-center gap-2">
                      <button id="theme-toggle-register" type="button" class="cursor-pointer rounded-full bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">${themeIcon}</button>
                      <button id="signIn" type="button" class="cursor-pointer rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-slate-600 dark:text-blue-300 dark:hover:bg-slate-700">Ya tengo cuenta</button>
                    </div>
                  </div>
                  <form id="register-form" class="mt-8 grid gap-5">
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="reg-name">Nombre completo</label>
                      <input id="reg-name" name="name" type="text" required placeholder="Ana Torres" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400" />
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="reg-email">Correo</label>
                      <input id="reg-email" name="email" type="email" required placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400" />
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="reg-password">Contrase&ntilde;a</label>
                      <div class="relative">
                        <input id="reg-password" name="password" type="password" required placeholder="Crea una contrase&ntilde;a" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400" />
                        <button id="toggle-reg-password" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" tabindex="-1">
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                      </div>
                      <div id="reg-password-strength" class="mt-2 hidden">
                        <div class="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                          <div id="reg-password-strength-bar" class="h-full rounded-full transition-all duration-300" style="width:0%"></div>
                        </div>
                        <p id="reg-password-strength-text" class="mt-1 text-xs text-slate-500 dark:text-slate-400"></p>
                        <ul id="reg-password-checklist" class="mt-2 space-y-1 text-xs">
                          <li id="check-length" class="text-slate-400"><span class="mr-1 inline-block w-4 text-center">○</span> Al menos 8 caracteres</li>
                          <li id="check-lower" class="text-slate-400"><span class="mr-1 inline-block w-4 text-center">○</span> Una letra min&uacute;scula</li>
                          <li id="check-upper" class="text-slate-400"><span class="mr-1 inline-block w-4 text-center">○</span> Una letra may&uacute;scula</li>
                          <li id="check-number" class="text-slate-400"><span class="mr-1 inline-block w-4 text-center">○</span> Un n&uacute;mero</li>
                          <li id="check-symbol" class="text-slate-400"><span class="mr-1 inline-block w-4 text-center">○</span> Un s&iacute;mbolo</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" for="reg-password-confirm">Confirmar contrase&ntilde;a</label>
                      <div class="relative">
                        <input id="reg-password-confirm" name="passwordConfirm" type="password" required placeholder="Repite tu contrase&ntilde;a" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400" />
                        <button id="toggle-reg-password-confirm" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" tabindex="-1">
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                      </div>
                      <p id="password-confirm-error" class="mt-1 hidden text-xs font-medium text-rose-500"></p>
                    </div>
                    <p id="register-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
                    <button id="register-submit" type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Registrarme</button>
                  </form>
                </div>
              </section>

            </section>

      </main>
    </div>
    `;
  },

  // afterRender: registra event listeners para toggle registro, visibilidad de contraseña,
  // fortaleza, tema oscuro y envío de formularios login/register
  afterRender: () => {
    const container = document.getElementById("auth-container");
    // Botones de cambio entre panel login y registro
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");

    if (signUpButton && container) {
      signUpButton.addEventListener("click", (e) => {
        e.preventDefault();
        container.classList.add("right-panel-active");
        history.replaceState(null, "Registro | TaskFlowSPA", "/register");
        document.title = "Registro | TaskFlowSPA";
      });
    }

    if (signInButton && container) {
      signInButton.addEventListener("click", (e) => {
        e.preventDefault();
        container.classList.remove("right-panel-active");
        history.replaceState(null, "Iniciar sesión | TaskFlowSPA", "/login");
        document.title = "Iniciar sesión | TaskFlowSPA";
      });
    }

    // Toggle de visibilidad de contraseña en login, registro y confirmación
    /* ---- Password toggle & strength ---- */
    document.getElementById("toggle-login-password")?.addEventListener("click", () => togglePasswordVisibility("login-password", "toggle-login-password"));
    document.getElementById("toggle-reg-password")?.addEventListener("click", () => togglePasswordVisibility("reg-password", "toggle-reg-password"));
    document.getElementById("toggle-reg-password-confirm")?.addEventListener("click", () => togglePasswordVisibility("reg-password-confirm", "toggle-reg-password-confirm"));

    const updatePasswordMatch = () => {
      const pw = document.getElementById("reg-password")?.value || "";
      const confirm = document.getElementById("reg-password-confirm")?.value || "";
      const confirmInput = document.getElementById("reg-password-confirm");
      const errorEl = document.getElementById("password-confirm-error");
      if (!confirmInput || !errorEl) return;
      if (!confirm) {
        confirmInput.classList.remove("border-rose-400", "border-green-400");
        errorEl.classList.add("hidden");
        return;
      }
      if (pw === confirm) {
        confirmInput.classList.remove("border-rose-400");
        confirmInput.classList.add("border-green-400");
        errorEl.classList.add("hidden");
      } else {
        confirmInput.classList.remove("border-green-400");
        confirmInput.classList.add("border-rose-400");
        errorEl.textContent = "La contraseña no coincide.";
        errorEl.classList.remove("hidden");
      }
    };
    document.getElementById("reg-password")?.addEventListener("input", (e) => {
      updatePasswordStrength(e.target.value);
      updatePasswordMatch();
    });
    document.getElementById("reg-password-confirm")?.addEventListener("input", updatePasswordMatch);

    // Alternar modo oscuro desde login o registro
    /* ---- Theme toggle ---- */
    const updateThemeIcons = () => {
      const icon = getTheme() === "dark" ? "☀️" : "🌙";
      document.querySelectorAll("#theme-toggle-login, #theme-toggle-register").forEach((btn) => {
        btn.textContent = icon;
      });
    };
    document.querySelectorAll("#theme-toggle-login, #theme-toggle-register").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleTheme();
        updateThemeIcons();
      });
    });

    // Envío del formulario de inicio de sesión
    /* ---- Login submit ---- */
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const loginBtn = document.getElementById("login-submit");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginError.textContent = "";
        loginBtn.disabled = true;
        loginBtn.textContent = "Ingresando...";
        const data = new FormData(loginForm);
        const email = data.get("email").toString().trim();
        const password = data.get("password").toString().trim();
        try {
          const user = await login({ email, password });
          if (!user) {
            loginError.textContent = "Correo o contraseña incorrectos.";
            loginBtn.disabled = false;
            loginBtn.textContent = "Entrar al dashboard";
            return;
          }
          goTo("/dashboard");
        } catch (error) {
          loginError.textContent = error.message || "Error al iniciar sesi&oacute;n.";
          loginBtn.disabled = false;
          loginBtn.textContent = "Entrar al dashboard";
        }
      });
    }

    // Envío del formulario de registro con validaciones de contraseña
    /* ---- Register submit ---- */
    const registerForm = document.getElementById("register-form");
    const registerError = document.getElementById("register-error");
    const registerBtn = document.getElementById("register-submit");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        registerError.textContent = "";
        const password = document.getElementById("reg-password")?.value || "";
        const confirm = document.getElementById("reg-password-confirm")?.value || "";
        if (password !== confirm) {
          registerError.textContent = "Las contrase&ntilde;as no coinciden.";
          return;
        }
        if (getPasswordStrength(password) < 5) {
          registerError.textContent = "La contrase&ntilde;a debe tener al menos 8 caracteres, may&uacute;sculas, min&uacute;sculas, n&uacute;meros y s&iacute;mbolos.";
          return;
        }
        registerBtn.disabled = true;
        registerBtn.textContent = "Registrando...";
        const data = new FormData(registerForm);
        const name = data.get("name").toString().trim();
        const email = data.get("email").toString().trim();
        try {
          const result = await register({ name, email, password });
          if (result.error) {
            registerError.textContent = result.error;
            registerBtn.disabled = false;
            registerBtn.textContent = "Registrarme";
            return;
          }
          goTo("/dashboard");
        } catch (error) {
          registerError.textContent = error.message || "Error al registrarse.";
          registerBtn.disabled = false;
          registerBtn.textContent = "Registrarme";
        }
      });
    }
  },
};
