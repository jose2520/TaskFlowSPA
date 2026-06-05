/* Servicio api.js
   Responsabilidad: Proporciona una capa abstracta para realizar peticiones HTTP
   (GET, POST, PATCH, DELETE) contra el backend fake (json-server).
   Centraliza el manejo de errores de red y la serialización JSON. */

// Constante con la URL base del backend fake (json-server)
const BASE_URL = "/api";

/* Realiza una petición HTTP genérica al endpoint indicado.
   @param {string} endpoint - Ruta del recurso (ej. "/users", "/tasks/123")
   @param {Object} [options={}] - Opciones adicionales para fetch (method, body, headers...)
   @returns {Promise<Object|null>} - Respuesta JSON del servidor o null si es 204 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con el servidor. Verifica que json-server esté corriendo.");
    }
    throw error;
  }
};

/* Objeto api con métodos abreviados para cada verbo HTTP. */
export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) =>
    request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: (endpoint, data) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
