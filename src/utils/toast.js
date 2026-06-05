// Utilidad para mostrar notificaciones toast y modales de confirmación.
// Reemplaza alert() y confirm() nativos por una experiencia visual mejorada.
let container;

// Crea o devuelve el contenedor flotante donde se renderizan los toasts.
const getContainer = () => {
  if (!container) {
    container = document.createElement("div");
    container.className = "fixed bottom-6 right-6 z-50 flex flex-col gap-3";
    document.body.appendChild(container);
  }
  return container;
};

/**
 * Muestra una notificación toast en pantalla con un color según el tipo.
 * @param {string} message - Texto del mensaje a mostrar
 * @param {"success" | "error" | "info" | "warning"} type - Tipo visual del toast
 * @param {number} duration - Duración en ms antes de ocultarse (default 3000)
 */
export const showToast = (message, type = "success", duration = 3000) => {
  const colors = {
    success: "bg-emerald-600 text-white",
    error: "bg-rose-600 text-white",
    info: "bg-blue-600 text-white",
    warning: "bg-amber-500 text-white",
  };

  const el = document.createElement("div");
  el.className = `rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg ${colors[type] || colors.info} animate-slide-up`;
  el.textContent = message;

  const c = getContainer();
  c.appendChild(el);

  setTimeout(() => {
    el.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => el.remove(), 300);
  }, duration);
};

/**
 * Muestra un modal para elegir formato de exportación (JSON o CSV).
 * @returns {Promise<"json" | "csv" | null>}
 */
export const showFormatPicker = (title) => {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm";

    overlay.innerHTML = `
      <div class="mx-4 w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl">
        <p class="text-center text-sm font-medium text-slate-700">${title}</p>
        <div class="mt-6 flex justify-center gap-3">
          <button id="format-json" class="rounded-full bg-orange-600 px-6 py-2 text-sm font-bold text-white hover:bg-orange-500">JSON</button>
          <button id="format-csv" class="rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-500">CSV</button>
          <button id="format-cancel" class="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancelar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#format-json").addEventListener("click", () => {
      overlay.remove();
      resolve("json");
    });

    overlay.querySelector("#format-csv").addEventListener("click", () => {
      overlay.remove();
      resolve("csv");
    });

    overlay.querySelector("#format-cancel").addEventListener("click", () => {
      overlay.remove();
      resolve(null);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(null);
      }
    });
  });
};

/**
 * Muestra un modal de confirmación que retorna una Promise con la respuesta.
 * @param {string} message - Texto de la pregunta a confirmar
 * @returns {Promise<boolean>} true si el usuario confirma, false si cancela
 */
export const showConfirm = (message) => {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm";

    const confirmText = message.toLowerCase().includes("eliminar") ? "Sí, eliminar" : "Sí, confirmar";

    overlay.innerHTML = `
      <div class="mx-4 w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl">
        <p class="text-center text-sm font-medium text-slate-700">${message}</p>
        <div class="mt-6 flex justify-center gap-3">
          <button id="confirm-yes" class="rounded-full bg-rose-600 px-6 py-2 text-sm font-bold text-white hover:bg-rose-500">${confirmText}</button>
          <button id="confirm-no" class="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Cancelar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#confirm-yes").addEventListener("click", () => {
      overlay.remove();
      resolve(true);
    });

    overlay.querySelector("#confirm-no").addEventListener("click", () => {
      overlay.remove();
      resolve(false);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
  });
};
