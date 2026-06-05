/* Servicio authService.js
   Responsabilidad: Gestiona la autenticación de usuarios: login, registro,
   actualización de perfil, eliminación de cuenta y cambio de roles.
   Depende de api.js para comunicación HTTP, de crypto.js para cifrado
   de contraseñas y de sessionService.js para persistencia de sesión. */

// Importa el cliente HTTP para peticiones al backend fake
import { api } from "./api.js";
<<<<<<< HEAD
import { getLocalData, setLocalData, removeLocalData } from "./storage.js";
<<<<<<< HEAD

const SESSION_KEY = "taskflowspa_session";

const getSession = () => getLocalData(SESSION_KEY, null);
const saveSession = (user) => setLocalData(SESSION_KEY, user);
=======
=======
// Importa funciones de cifrado/descifrado para contraseñas
>>>>>>> 67ec89a (update)
import { encrypt, decrypt } from "../utils/crypto.js";
// Importa servicio de registro de actividad (logs)
import { addLog } from "./logService.js";
// Importa funciones de manejo de sesión
import { getSession, saveSession, logout, getCurrentUser, isAdmin } from "./sessionService.js";

<<<<<<< HEAD
const SESSION_KEY = "taskflowspa_session";

const getSession = () => {
  const data = getLocalData(SESSION_KEY, null);
  if (data?.password) {
    data.password = decrypt(data.password);
  }
  return data;
};
const saveSession = (user) => {
  if (user?.password) {
    setLocalData(SESSION_KEY, { ...user, password: encrypt(user.password) });
  } else {
    setLocalData(SESSION_KEY, user);
  }
};
>>>>>>> 697fb27 (update)

export const getCurrentUser = () => getSession();
=======
// Reexporta utilidades de sesión para acceso directo desde authService
export { getCurrentUser, isAdmin } from "./sessionService.js";
>>>>>>> 67ec89a (update)

/* Verifica si hay un usuario autenticado.
   @returns {boolean} - true si existe sesión activa, false en caso contrario */
export const isAuthenticated = () => Boolean(getSession());

/* Obtiene todos los usuarios del sistema.
   @returns {Promise<Array>} - Lista de usuarios */
export const getAllUsers = () => api.get("/users");

/* Inicia sesión con email y contraseña.
   @param {Object} credenciales - { email: string, password: string }
   @returns {Promise<Object|null>} - Usuario autenticado o null si falla */
export const login = async ({ email, password }) => {
<<<<<<< HEAD
  const users = await api.get(`/users?email=${encodeURIComponent(email.toLowerCase())}&password=${encodeURIComponent(password)}`);
  const user = users.length > 0 ? users[0] : null;
  if (!user) return null;
  saveSession({ ...user });
=======
  const users = await api.get(`/users?email=${encodeURIComponent(email.toLowerCase())}`);
  if (users.length === 0) return null;
  const user = users[0];
  const storedPassword = decrypt(user.password);
  if (storedPassword !== password) return null;
  saveSession({ ...user, password: storedPassword });
>>>>>>> 697fb27 (update)
  return user;
};

/* Registra un nuevo usuario en el sistema.
   @param {Object} datos - { name: string, email: string, password: string }
   @returns {Promise<Object>} - { user } si éxito, o { error } si el email ya existe */
export const register = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existing = await api.get(`/users?email=${encodeURIComponent(normalizedEmail)}`);
  if (existing.length > 0) {
    return { error: "El correo ya está registrado." };
  }

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
<<<<<<< HEAD
    password,
    role: "USER",
  };
  const created = await api.post("/users", newUser);
  saveSession({ ...created });
=======
    password: encrypt(password),
    role: "USER",
  };
  const created = await api.post("/users", newUser);
  saveSession({ ...created, password });
<<<<<<< HEAD
>>>>>>> 697fb27 (update)
=======
  addLog("Registro", `Usuario ${name} se registró`);
>>>>>>> 67ec89a (update)
  return { user: created };
};

/* Actualiza el perfil del usuario autenticado.
   @param {Object} datos - { id: string, name: string, email: string, password?: string }
   @returns {Promise<Object>} - { user } si éxito, o { error } si el email ya está en uso */
export const updateProfile = async ({ id, name, email, password }) => {
  const currentSession = getSession();
  if (!currentSession || currentSession.id !== id) {
    return { error: "No puedes editar otro perfil" };
  }
  const normalizedEmail = email.toLowerCase();
  const allUsers = await api.get("/users");
  const emailConflict = allUsers.some(
    (user) => user.id !== id && user.email.toLowerCase() === normalizedEmail
  );
  if (emailConflict) return { error: "El correo ya está en uso." };

<<<<<<< HEAD
  const updated = await api.patch(`/users/${id}`, {
    name: name.trim(),
    email: normalizedEmail,
    password: password || undefined,
  });
  saveSession({ ...updated });
=======
  const patchData = {
    name: name.trim(),
    email: normalizedEmail,
  };
  if (password) {
    patchData.password = encrypt(password);
  }

  const updated = await api.patch(`/users/${id}`, patchData);
  const sessionPassword = password || getSession()?.password;
  saveSession({ ...updated, password: sessionPassword });
>>>>>>> 697fb27 (update)
  return { user: updated };
};

/* Elimina la cuenta de un usuario (la propia o por admin).
   @param {string} userId - ID del usuario a eliminar
   @returns {Promise<boolean>} - true si se eliminó correctamente */
export const deleteAccount = async (userId) => {
  const currentSession = getSession();
  if (!currentSession) throw new Error("No autenticado");
  if (currentSession.id !== userId && !isAdmin()) {
    throw new Error("No tienes permiso para eliminar esta cuenta");
  }
  await api.delete(`/users/${userId}`);
  if (currentSession.id === userId) {
    addLog("Cuenta eliminada", `${currentSession.name} eliminó su propia cuenta`);
    logout();
  } else {
    addLog("Usuario eliminado", `Usuario ID ${userId} eliminado por ${currentSession?.name || "admin"}`);
  }
  return true;
};

/* Cambia el rol de un usuario (solo para ADMIN).
   @param {string} userId - ID del usuario
   @param {string} role - Nuevo rol ("USER" | "ADMIN")
   @returns {Promise<Object>} - Usuario actualizado */
export const changeUserRole = async (userId, role) => {
  if (!isAdmin()) throw new Error("Solo administradores pueden cambiar roles");
  const updated = await api.patch(`/users/${userId}`, { role });
  const currentSession = getSession();
  if (currentSession && currentSession.id === userId) {
<<<<<<< HEAD
    saveSession({ ...updated });
=======
    saveSession({ ...updated, password: currentSession.password });
>>>>>>> 697fb27 (update)
  }
  addLog("Rol cambiado", `${updated.name} ahora es ${role} (por ${currentSession?.name || "admin"})`);
  return updated;
};
