const KEY = 0x5A;
const PREFIX = "enc:";

export const encrypt = (str) => {
  if (!str) return "";
  const encoded = [...String(str)].map((c) =>
    String.fromCharCode(c.charCodeAt(0) ^ KEY),
  );
  return PREFIX + btoa(encoded.join(""));
};

export const decrypt = (str) => {
  if (!str || !str.startsWith(PREFIX)) return str;
  try {
    const raw = atob(str.slice(PREFIX.length));
    const decoded = [...raw].map((c) =>
      String.fromCharCode(c.charCodeAt(0) ^ KEY),
    );
    return decoded.join("");
  } catch {
    return str;
  }
};
