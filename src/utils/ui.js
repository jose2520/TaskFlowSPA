/**
 * Retorna clases de Tailwind para el badge de estado de una tarea.
 * @param {"pending" | "in-progress" | "completed"} status - Estado de la tarea
 * @returns {string} Clases de color según el estado
 */
export const statusBadge = (status) => {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    "in-progress": "bg-sky-100 text-sky-700",
    completed: "bg-emerald-100 text-emerald-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};
