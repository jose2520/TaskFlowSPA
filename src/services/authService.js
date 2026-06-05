/* Servicio authService.js
   Responsabilidad: Gestiona la autenticación de usuarios: login, registro,
   actualización de perfil, eliminación de cuenta y cambio de roles.
   Depende de api.js para comunicación HTTP, de crypto.js para cifrado
   de contraseñas y de sessionService.js para persistencia de sesión. */

import { api } from "./api.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { addLog } from "./logService.js";
import {
  getSession,
  saveSession,
  logout,
  getCurrentUser,
  isAdmin,
} from "./sessionService.js";

/* Normaliza un email: recorta espacios y convierte a minúsculas.
   @param {string} email - Correo a normalizar
   @returns {string} Email normalizado */
const normalizeEmail = (email) => String(email).trim().toLowerCase();

/* Descifra una contraseña almacenada (formato "enc:...") o retorna vacío si no es válida.
   @param {string} password - Contraseña cifrada
   @returns {string} Contraseña en texto plano */
const decodePassword = (password) => {
  if (typeof password !== "string") return "";
  return decrypt(password);
};

/* Verifica si hay un usuario autenticado.
   @returns {boolean} true si existe sesión activa */
export const isAuthenticated = () => Boolean(getSession());

/* Obtiene todos los usuarios del sistema.
   @returns {Promise<Array>} Lista de usuarios */
export const getAllUsers = () => api.get("/users");

/* Re-exporta helpers de sesión para acceso directo desde authService. */
export { getCurrentUser, isAdmin };

/* Inicia sesión con email y contraseña.
   Busca al usuario por email, descifra su contraseña almacenada y la compara.
   @param {Object} credenciales - { email: string, password: string }
   @returns {Promise<Object|null>} Usuario autenticado o null si falla */
export const login = async ({ email, password }) => {
  const users = await api.get(
    `/users?email=${encodeURIComponent(normalizeEmail(email))}`
  );
  if (!users.length) return null;

  const user = users[0];
  const storedPassword = decodePassword(user.password);
  if (!storedPassword || storedPassword !== password) return null;

  saveSession({ ...user, password: storedPassword });
  return user;
};

/* Registra un nuevo usuario en el sistema.
   Valida que el email no exista, cifra la contraseña y persiste la sesión.
   @param {Object} datos - { name: string, email: string, password: string }
   @returns {Promise<Object>} { user } si éxito, o { error } si el email ya existe */
export const register = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const existing = await api.get(
    `/users?email=${encodeURIComponent(normalizedEmail)}`
  );
  if (existing.length > 0) {
    return { error: "El correo ya está registrado." };
  }

  const newUser = {
    id: Date.now().toString(),
    name: String(name).trim(),
    email: normalizedEmail,
    password: encrypt(password),
    role: "USER",
  };

  const created = await api.post("/users", newUser);
  saveSession({ ...created, password });
  addLog("Registro", `Usuario ${created.name} se registró`);

  return { user: created };
};

/* Actualiza el perfil del usuario autenticado.
   Solo permite editar la propia cuenta. Verifica que el nuevo email no esté en uso.
   @param {Object} datos - { id: string, name: string, email: string, password?: string }
   @returns {Promise<Object>} { user } si éxito, o { error } si hay conflicto */
export const updateProfile = async ({ id, name, email, password }) => {
  const currentSession = getSession();
  if (!currentSession || currentSession.id !== id) {
    return { error: "No puedes editar otro perfil" };
  }

  const normalizedEmail = normalizeEmail(email);
  const allUsers = await api.get("/users");
  const emailConflict = allUsers.some(
    (user) => user.id !== id && normalizeEmail(user.email) === normalizedEmail
  );
  if (emailConflict) return { error: "El correo ya está en uso." };

  const patchData = {
    name: String(name).trim(),
    email: normalizedEmail,
  };
  if (password) {
    patchData.password = encrypt(password);
  }

  const updated = await api.patch(`/users/${id}`, patchData);
  const sessionPassword = password || currentSession.password;
  saveSession({ ...updated, password: sessionPassword });
  addLog("Perfil actualizado", `Usuario ${updated.name} actualizó su perfil`);

  return { user: updated };
};

/* Elimina la cuenta de un usuario (la propia o por admin).
   Si el usuario se elimina a sí mismo, cierra la sesión.
   @param {string} userId - ID del usuario a eliminar
   @returns {Promise<boolean>} true si se eliminó correctamente */
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
    addLog(
      "Usuario eliminado",
      `Usuario ID ${userId} eliminado por ${currentSession?.name || "admin"}`
    );
  }

  return true;
};

/* Cambia el rol de un usuario (solo para ADMIN).
   Si el cambio es sobre sí mismo, actualiza también la sesión local.
   @param {string} userId - ID del usuario
   @param {string} role - Nuevo rol ("USER" | "ADMIN")
   @returns {Promise<Object>} Usuario actualizado */
export const changeUserRole = async (userId, role) => {
  if (!isAdmin()) throw new Error("Solo administradores pueden cambiar roles");

  const updated = await api.patch(`/users/${userId}`, { role });
  const currentSession = getSession();
  if (currentSession && currentSession.id === userId) {
    saveSession({ ...updated, password: currentSession.password });
  }

  addLog(
    "Rol cambiado",
    `${updated.name} ahora es ${role} (por ${currentSession?.name || "admin"})`
  );
  return updated;
};
