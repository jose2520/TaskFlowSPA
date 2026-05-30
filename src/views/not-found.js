export default {
  title: "404",
  render: async () => `
    <section class="grid min-h-[70vh] place-items-center text-center">
      <div class="max-w-xl rounded-[2rem] border border-blue-100 bg-white p-10 shadow-lg shadow-blue-50">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Página no encontrada</p>
        <h1 class="mt-4 text-5xl font-black text-slate-900">404</h1>
        <p class="mt-4 text-slate-600">La ruta solicitada no existe o no está disponible en este momento.</p>
        <div class="mt-8">
          <a data-link href="/" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500">Volver al inicio</a>
        </div>
      </div>
    </section>
  `,
};
