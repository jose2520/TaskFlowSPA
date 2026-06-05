/**
 * Calcula la fortaleza de una contraseña según 5 criterios (longitud, minúscula, mayúscula, dígito, símbolo).
 * @param {string} pw - Contraseña a evaluar
 * @returns {number} Puntaje entre 0 y 5
 */
export const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1;
  return score;
};

// Configuración de niveles de fortaleza: puntaje mínimo, etiqueta, color Tailwind y ancho de barra.
const strengthConfig = [
  { min: 0, label: "", color: "", width: "0%" },
  { min: 1, label: "Muy d&eacute;bil", color: "bg-red-500", width: "20%" },
  { min: 2, label: "D&eacute;bil", color: "bg-orange-500", width: "40%" },
  { min: 3, label: "Regular", color: "bg-yellow-500", width: "60%" },
  { min: 4, label: "Buena", color: "bg-lime-500", width: "80%" },
  { min: 5, label: "Fuerte", color: "bg-emerald-500", width: "100%" },
];

// Reglas individuales del checklist con su ID de elemento DOM y función de validación.
const checklistRules = [
  { id: "check-length", test: (pw) => pw.length >= 8 },
  { id: "check-lower", test: (pw) => /[a-z]/.test(pw) },
  { id: "check-upper", test: (pw) => /[A-Z]/.test(pw) },
  { id: "check-number", test: (pw) => /[0-9]/.test(pw) },
  { id: "check-symbol", test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
];

/**
 * Actualiza la UI de fortaleza de contraseña: barra de progreso, etiqueta y checklist en tiempo real.
 * @param {string} pw - Contraseña actual del campo de registro
 */
export const updatePasswordStrength = (pw) => {
  const container = document.getElementById("reg-password-strength");
  const bar = document.getElementById("reg-password-strength-bar");
  const text = document.getElementById("reg-password-strength-text");
  if (!container || !bar || !text) return;
  if (!pw) {
    container.classList.add("hidden");
    return;
  }
  container.classList.remove("hidden");
  const score = getPasswordStrength(pw);
  const level = strengthConfig.slice().reverse().find((s) => score >= s.min);
  bar.style.width = level?.width || "0%";
  bar.className = `h-full rounded-full transition-all duration-300 ${level?.color || ""}`;
  text.innerHTML = level?.label || "";
  checklistRules.forEach(({ id, test }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const span = el.querySelector("span");
    const ok = test(pw);
    if (ok) {
      el.classList.remove("text-slate-400");
      el.classList.add("text-emerald-600", "dark:text-emerald-400");
      if (span) span.textContent = "\u2713";
    } else {
      el.classList.remove("text-emerald-600", "dark:text-emerald-400");
      el.classList.add("text-slate-400");
      if (span) span.textContent = "\u2717";
    }
  });
};
