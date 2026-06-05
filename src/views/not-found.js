// Vista 404 - Página no encontrada
// Renderiza una pantalla simple cuando la ruta solicitada no existe.

export default {
  // Título de la página
  title: "404",

  // render: genera el HTML de la vista 404 con un mensaje descriptivo y un enlace al inicio
  render: async () => `
    <section class="grid min-h-[70vh] place-items-center text-center">

      <!-- Contenedor principal con estilo de tarjeta -->
      <div class="max-w-xl rounded-[2rem] border border-blue-100 bg-white p-10 shadow-lg shadow-blue-50">

        <!-- Indicador de página no encontrada -->
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Página no encontrada</p>

        <!-- Código 404 grande como título visual -->
        <h1 class="mt-4 text-5xl font-black text-slate-900">404</h1>

        <!-- Mensaje explicativo para el usuario -->
        <p class="mt-4 text-slate-600">La ruta solicitada no existe o no está disponible en este momento.</p>

        <!-- Enlace de regreso al inicio de la aplicación -->
        <div class="mt-8">
          <a data-link href="/" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500">Volver al inicio</a>
        </div>
      </div>
    </section>
  `,
};
