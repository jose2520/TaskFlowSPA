/* Servicio storage.js
   Responsabilidad: Encapsula el acceso a localStorage con parseo seguro
   de JSON. Provee operaciones básicas get, set y remove para mantener
   la persistencia local abstraída del resto de la aplicación. */

/* Parsea un string JSON de forma segura, retornando un valor por defecto
   si la cadena está vacía o el formato es inválido.
   @param {string|null} value - String JSON a parsear
   @param {*} fallback - Valor por defecto si falla el parseo
   @returns {*} - Objeto parseado o fallback */
const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/* Obtiene un valor almacenado en localStorage y lo parsea como JSON.
   @param {string} key - Clave del item en localStorage
   @param {*} [fallback=null] - Valor por defecto si no existe o falla el parseo
   @returns {*} - Valor deserializado o fallback */
export const getLocalData = (key, fallback = null) => {
  return parseJson(localStorage.getItem(key), fallback);
};

/* Almacena un valor en localStorage serializado como JSON.
   @param {string} key - Clave del item en localStorage
   @param {*} value - Valor a serializar y almacenar
   @returns {void} */
export const setLocalData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/* Elimina un item de localStorage.
   @param {string} key - Clave del item a eliminar
   @returns {void} */
export const removeLocalData = (key) => {
  localStorage.removeItem(key);
};
