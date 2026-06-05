// Crea un enlace temporal y dispara la descarga del archivo en el navegador.
// @param {Blob} blob - Datos del archivo
// @param {string} filename - Nombre base sin extensión
// @param {string} ext - Extensión del archivo (json, csv)
const download = (blob, filename, ext) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Exporta un objeto/array como archivo JSON descargable.
 * @param {*} data - Datos a serializar en JSON
 * @param {string} filename - Nombre del archivo sin extensión
 */
export const exportAsJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  download(blob, filename, "json");
};

/**
 * Exporta un array de objetos como archivo CSV descargable.
 * @param {Object[]} data - Array de objetos planos
 * @param {string} filename - Nombre del archivo sin extensión
 * @param {string[]} headers - Lista de nombres de columna
 */
export const exportAsCSV = (data, filename, headers) => {
  const csvRows = [headers.join(",")];
  for (const row of data) {
    csvRows.push(headers.map((h) => `"${String(row[h] || "").replace(/"/g, '""')}"`).join(","));
  }
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  download(blob, filename, "csv");
};
