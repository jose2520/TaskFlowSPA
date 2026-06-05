/* Servicio sessionService.js
   Responsabilidad: Administra la sesión del usuario autenticado.
   Persiste y restaura la sesión desde localStorage, cifrando la contraseña
   para su almacenamiento. Provee helpers para verificar autenticación y rol. */

// Importa utilidades de almacenamiento local
import { getLocalData, setLocalData, removeLocalData } from "./storage.js";
// Importa funciones de cifrado/descifrado para la contraseña en sesión
import { decrypt, encrypt } from "../utils/crypto.js";

// Clave usada en localStorage para guardar/recuperar la sesión
const SESSION_KEY = "taskflowspa_session";

/* Recupera la sesión actual desde localStorage.
   Descifra la contraseña antes de devolver los datos.
   @returns {Object|null} - Datos del usuario en sesión o null */
export const getSession = () => {
  const data = getLocalData(SESSION_KEY, null);
  if (data?.password) {
    data.password = decrypt(data.password);
  }
  return data;
};

/* Guarda la sesión en localStorage, cifrando la contraseña.
   @param {Object} user - Datos del usuario a persistir */
export const saveSession = (user) => {
  if (user?.password) {
    setLocalData(SESSION_KEY, { ...user, password: encrypt(user.password) });
  } else {
    setLocalData(SESSION_KEY, user);
  }
};

/* Obtiene el usuario actual de la sesión (alias de getSession).
   @returns {Object|null} - Usuario en sesión o null */
export const getCurrentUser = () => getSession();

/* Verifica si hay un usuario autenticado.
   @returns {boolean} - true si existe sesión activa */
export const isAuthenticated = () => Boolean(getSession());

/* Verifica si el usuario autenticado tiene rol ADMIN.
   @returns {boolean} - true si el rol es "ADMIN" */
export const isAdmin = () => {
  const session = getSession();
  return session?.role === "ADMIN";
};

/* Cierra la sesión eliminando los datos de localStorage.
   @returns {void} */
export const logout = () => {
  removeLocalData(SESSION_KEY);
};
