import { login, register } from "../services/authService.js";
import { goTo, escapeHtml } from "../utils/dom.js";

export default {
  title: "Login",
  render: async ({ currentPath }) => {
    const isRegister = currentPath === "/register";
    document.title = isRegister ? "Registro | TaskFlowSPA" : "Iniciar sesión | TaskFlowSPA";

    return `
    <div id="auth-container" class="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-100 text-slate-800 ${isRegister ? "right-panel-active" : ""}">

      <main class="relative grid min-h-screen overflow-hidden lg:grid-cols-[1fr_0.95fr]">

            <!-- ========== FONDO: LOGIN ========== -->

            <!-- Login form (izquierda) -->
            <section class="sign-in-container flex items-center justify-center px-6 py-10">
              <div class="w-full max-w-xl">
                <div class="flex items-center justify-between">
                  <a data-link class="text-xl font-black tracking-tight text-blue-900" href="/">TaskFlowSPA</a>
                  <button id="signUp" type="button" class="cursor-pointer rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Registrarse</button>
                </div>
                <div class="mt-8">
                  <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Inicio de sesi&oacute;n</p>
                  <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900">Bienvenido de nuevo</h1>
                  <p class="mt-4 text-slate-600">Ingresa a tu espacio de trabajo y contin&uacute;a organizando tus tareas.</p>
                </div>
                <form id="login-form" class="mt-8 grid gap-5">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700" for="login-email">Correo</label>
                    <input id="login-email" name="email" type="email" required placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-slate-700" for="login-password">Contrase&ntilde;a</label>
                    <input id="login-password" name="password" type="password" required placeholder="Ingresa tu contrase&ntilde;a" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
                  </div>
                  <p id="login-error" class="min-h-[1.5rem] text-sm font-medium text-rose-600"></p>
                  <button id="login-submit" type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">Entrar al dashboard</button>
                </form>
              </div>
            </section>

            <!-- Login promo (derecha) -->
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
            <section class="sign-up-container absolute inset-0 z-20 grid overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">

              <!-- Register promo (izquierda del overlay) -->
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
              <section class="info-panel2 flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-blue-100 px-6 py-10">
                <div class="w-full max-w-xl">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Registro</p>
                      <h2 class="mt-2 text-3xl font-black text-slate-900">Crear cuenta</h2>
                    </div>
                    <button id="signIn" type="button" class="cursor-pointer rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Ya tengo cuenta</button>
                  </div>
                  <form id="register-form" class="mt-8 grid gap-5">
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700" for="reg-name">Nombre completo</label>
                      <input id="reg-name" name="name" type="text" required placeholder="Ana Torres" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700" for="reg-email">Correo</label>
                      <input id="reg-email" name="email" type="email" required placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
                    </div>
                    <div>
                      <label class="mb-2 block text-sm font-medium text-slate-700" for="reg-password">Contrase&ntilde;a</label>
                      <input id="reg-password" name="password" type="password" required placeholder="Crea una contrase&ntilde;a" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
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

  afterRender: () => {
    const container = document.getElementById("auth-container");
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");

    if (signUpButton) {
      signUpButton.addEventListener("click", (e) => {
        e.preventDefault();
        container.classList.add("right-panel-active");
        history.replaceState(null, "Registro | TaskFlowSPA", "/register");
        document.title = "Registro | TaskFlowSPA";
      });
    }

    if (signInButton) {
      signInButton.addEventListener("click", (e) => {
        e.preventDefault();
        container.classList.remove("right-panel-active");
        history.replaceState(null, "Iniciar sesión | TaskFlowSPA", "/login");
        document.title = "Iniciar sesión | TaskFlowSPA";
      });
    }

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
            loginError.textContent = "Correo o contrase&ntilde;a incorrectos.";
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

    /* ---- Register submit ---- */
    const registerForm = document.getElementById("register-form");
    const registerError = document.getElementById("register-error");
    const registerBtn = document.getElementById("register-submit");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        registerError.textContent = "";
        registerBtn.disabled = true;
        registerBtn.textContent = "Registrando...";
        const data = new FormData(registerForm);
        const name = data.get("name").toString().trim();
        const email = data.get("email").toString().trim();
        const password = data.get("password").toString().trim();
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
