/**
 * Escapa caracteres HTML para prevenir inyección XSS.
 * @param {string} str - Cadena con posible HTML
 * @returns {string} Cadena escapada
 */
export const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Navega a una URL interna usando History API, disparando popstate para que el router reaccione.
 * @param {string} url - Ruta destino (ej. "/tasks")
 */
export const goTo = (url) => {
  history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

/**
 * Alterna la visibilidad de un campo de contraseña entre "password" y "text".
 * @param {string} inputId - ID del input de tipo password
 * @param {string} btnId - ID del botón que dispara el toggle
 */
export const togglePasswordVisibility = (inputId, btnId) => {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  btn.innerHTML = isPassword
    ? `<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 001.06-1.06l-18-18zM22.676 12.001c-1.234-3.504-4.399-6.06-8.18-6.673a.75.75 0 00-.717.254.75.75 0 00.067 1.052c3.1 2.538 4.967 6.21 4.967 9.367 0 .338-.014.673-.04 1.004a.75.75 0 001.492.158c.032-.386.048-.775.048-1.162 0-.264.028-.527.083-.78.16-.743.46-1.448.853-2.092.053-.09.095-.184.125-.28a.75.75 0 00-.652-.948zM12 18.25c-3.31 0-6.19-1.88-7.78-4.72a.75.75 0 010-.66C5.476 10.28 7.66 8.602 10.22 8.03a.75.75 0 11.374 1.452 6.126 6.126 0 00-4.194 2.64c.206.305.43.598.672.876a.75.75 0 01-.25 1.172l-.003.001a.75.75 0 01-.818-.187 7.56 7.56 0 01-.817-1.08 7.528 7.528 0 00-.11.228 6.508 6.508 0 00.123 5.036c1.183 2.283 3.427 3.832 6.003 4.181a.75.75 0 01-.204 1.486c-3.318-.456-6.187-2.45-7.778-5.272a6.452 6.452 0 01-.11-.232 8.507 8.507 0 01-.613-1.356A8.492 8.492 0 012 12c0-.628.068-1.24.197-1.83.128-.59.316-1.156.557-1.69.084-.182.172-.36.264-.536l.038-.07A9.932 9.932 0 0112 4.25c2.063 0 3.97.63 5.567 1.708l1.404-1.404a.75.75 0 011.06 1.06l-18 18z"/></svg>`
    : `<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
};
