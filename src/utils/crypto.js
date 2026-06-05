// Clave fija para cifrado XOR (0x5A = 90 en decimal)
const KEY = 0x5A;
// Prefijo que identifica valores cifrados por la app
const PREFIX = "enc:";

/**
 * Cifra un texto aplicando XOR con la clave KEY y luego base64.
 * @param {string} str - Texto plano a cifrar
 * @returns {string} Texto cifrado con prefijo "enc:"
 */
export const encrypt = (str) => {
  if (!str) return "";
  // Aplica XOR byte a byte contra la clave
  const encoded = [...String(str)].map((c) =>
    String.fromCharCode(c.charCodeAt(0) ^ KEY),
  );
  return PREFIX + btoa(encoded.join(""));
};

/**
 * Descifra un texto previamente cifrado con encrypt (XOR + base64).
 * @param {string} str - Texto cifrado con prefijo "enc:"
 * @returns {string} Texto plano original, o el mismo str si no está cifrado
 */
export const decrypt = (str) => {
  if (!str || !str.startsWith(PREFIX)) return str;
  try {
    // Quita el prefijo, decodifica base64 y aplica XOR inverso
    const raw = atob(str.slice(PREFIX.length));
    const decoded = [...raw].map((c) =>
      String.fromCharCode(c.charCodeAt(0) ^ KEY),
    );
    return decoded.join("");
  } catch {
    return str;
  }
};
