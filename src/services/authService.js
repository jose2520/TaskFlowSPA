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

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const decodePassword = (password) => {
  if (typeof password !== "string") return "";
  return decrypt(password);
};

export const isAuthenticated = () => Boolean(getSession());
export const getAllUsers = () => api.get("/users");
export { getCurrentUser, isAdmin };

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
