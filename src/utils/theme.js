const THEME_KEY = "taskflowspa_theme";

/**
 * Obtiene el tema actual desde localStorage.
 * @returns {"light" | "dark"} Tema guardado o "light" por defecto
 */
export const getTheme = () => {
  return localStorage.getItem(THEME_KEY) || "light";
};

/**
 * Guarda el tema en localStorage y lo aplica visualmente.
 * @param {"light" | "dark"} theme - Tema a establecer
 */
export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

/**
 * Alterna entre modo claro y oscuro.
 * @returns {"light" | "dark"} Nuevo tema activo
 */
export const toggleTheme = () => {
  const next = getTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
};

/**
 * Aplica o remueve la clase "dark" en el elemento <html>
 * y actualiza los meta tags de color-scheme y theme-color.
 * @param {"light" | "dark"} theme - Tema a reflejar en el DOM
 */
export const applyTheme = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  const metaColorScheme = document.querySelector("meta[name='color-scheme']");
  if (metaColorScheme) metaColorScheme.content = theme;
  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (metaThemeColor) metaThemeColor.content = theme === "dark" ? "#1e293b" : "#dbeafe";
};

/**
 * Inicializa el tema al cargar la app restaurando la preferencia guardada.
 */
export const initTheme = () => {
  applyTheme(getTheme());
};
