import { api } from "./api.js";
import { getLocalData, setLocalData, removeLocalData } from "./storage.js";
<<<<<<< HEAD

const SESSION_KEY = "taskflowspa_session";

const getSession = () => getLocalData(SESSION_KEY, null);
const saveSession = (user) => setLocalData(SESSION_KEY, user);
=======
import { encrypt, decrypt } from "../utils/crypto.js";

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

export const isAuthenticated = () => Boolean(getSession());

export const isAdmin = () => {
  const session = getSession();
  return session?.role === "ADMIN";
};

export const getAllUsers = () => api.get("/users");

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
>>>>>>> 697fb27 (update)
  return { user: created };
};

export const updateProfile = async ({ id, name, email, password }) => {
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
<<<<<<< HEAD
    saveSession({ ...updated });
=======
    saveSession({ ...updated, password: currentSession.password });
>>>>>>> 697fb27 (update)
  }
  return updated;
};
