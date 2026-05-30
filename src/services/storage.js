const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const getLocalData = (key, fallback = null) => {
  return parseJson(localStorage.getItem(key), fallback);
};

export const setLocalData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalData = (key) => {
  localStorage.removeItem(key);
};
