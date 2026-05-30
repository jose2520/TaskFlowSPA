import { api } from "./api.js";
import { getLocalData, setLocalData, removeLocalData } from "./storage.js";

const SESSION_KEY = "taskflowspa_session";

const getSession = () => getLocalData(SESSION_KEY, null);
const saveSession = (user) => setLocalData(SESSION_KEY, user);

export const getCurrentUser = () => getSession();

export const isAuthenticated = () => Boolean(getSession());

export const isAdmin = () => {
  const session = getSession();
  return session?.role === "ADMIN";
};

export const getAllUsers = () => api.get("/users");

export const login = async ({ email, password }) => {
  const users = await api.get(`/users?email=${encodeURIComponent(email.toLowerCase())}&password=${encodeURIComponent(password)}`);
  const user = users.length > 0 ? users[0] : null;
  if (!user) return null;
  saveSession({ ...user });
  return user;
};

export const logout = () => {
  removeLocalData(SESSION_KEY);
};

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
    password,
    role: "USER",
  };
  const created = await api.post("/users", newUser);
  saveSession({ ...created });
  return { user: created };
};

export const updateProfile = async ({ id, name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const allUsers = await api.get("/users");
  const emailConflict = allUsers.some(
    (user) => user.id !== id && user.email.toLowerCase() === normalizedEmail
  );
  if (emailConflict) return { error: "El correo ya está en uso." };

  const updated = await api.patch(`/users/${id}`, {
    name: name.trim(),
    email: normalizedEmail,
    password: password || undefined,
  });
  saveSession({ ...updated });
  return { user: updated };
};

export const deleteAccount = async (userId) => {
  await api.delete(`/users/${userId}`);
  const currentSession = getSession();
  if (currentSession && currentSession.id === userId) {
    logout();
  }
  return true;
};

export const changeUserRole = async (userId, role) => {
  const updated = await api.patch(`/users/${userId}`, { role });
  const currentSession = getSession();
  if (currentSession && currentSession.id === userId) {
    saveSession({ ...updated });
  }
  return updated;
};
