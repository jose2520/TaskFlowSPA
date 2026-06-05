/* Servicio logService.js
   Responsabilidad: Registra y consulta el historial de actividad
   de la aplicación. Cada entrada incluye usuario, acción, detalle
   y timestamp. Mantiene un máximo de 100 registros. */

// Importa utilidades de almacenamiento local
import { getLocalData, setLocalData } from "./storage.js";
// Importa utilidad para obtener el usuario actual
import { getCurrentUser } from "./authService.js";

// Clave usada en localStorage para guardar el log de actividad
const LOG_KEY = "taskflowspa_log";

/* Obtiene la lista completa de registros de actividad.
   @returns {Array} - Array de objetos { id, timestamp, user, userId, action, detail } */
export const getLog = () => getLocalData(LOG_KEY, []);

/* Agrega un nuevo registro al log de actividad.
   @param {string} action - Tipo de acción (ej. "Tarea creada", "Login")
   @param {string} detail - Descripción detallada de la acción
   @returns {void} */
export const addLog = (action, detail) => {
  const logs = getLog();
  const user = getCurrentUser();
  logs.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    user: user?.name || "Sistema",
    userId: user?.id || null,
    action,
    detail,
  });
  if (logs.length > 100) logs.length = 100;
  setLocalData(LOG_KEY, logs);
};

/* Limpia todo el historial de actividad.
   @returns {void} */
export const clearLog = () => {
  setLocalData(LOG_KEY, []);
};
