/**
 * Filtra y ordena una lista de tareas según los criterios especificados.
 * @param {Object[]} tasks - Array de tareas
 * @param {string} [search] - Texto de búsqueda (filtra por título y descripción)
 * @param {string} [statusFilter] - Estado a filtrar ("all" para mostrar todos)
 * @param {"createdAt" | "dueDate" | "title"} [sortBy] - Campo de ordenamiento
 * @returns {Object[]} Tareas filtradas y ordenadas
 */
export const applyFiltersAndSort = (tasks, { search, statusFilter, sortBy }) => {
  let filtered = [...tasks];

  // Filtro por búsqueda textual en título y descripción (insensible a mayúsculas)
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }

  // Filtro por estado de la tarea
  if (statusFilter && statusFilter !== "all") {
    filtered = filtered.filter((t) => t.status === statusFilter);
  }

  // Ordenamiento por fecha de creación (más reciente primero)
  if (sortBy === "createdAt") {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  // Ordenamiento por fecha de vencimiento (tareas sin fecha al final)
  } else if (sortBy === "dueDate") {
    filtered.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  // Ordenamiento alfabético por título
  } else if (sortBy === "title") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
};
