# AGENTS.md

Guia para agentes y colaboradores que trabajen en `TaskFlowSPA`.

## Mision del proyecto

Construir una SPA de gestion de tareas con JavaScript Vanilla, HTML, CSS y Tailwind CSS que sirva como practica de arquitectura frontend moderna, modularizacion, routing del lado del cliente y control de acceso sin usar frameworks SPA.

## Tipo de arquitectura

Este repositorio usa una arquitectura frontend simple por capas (`layered architecture`) pensada para una primera SPA.

La prioridad no es aplicar una estructura compleja, sino ayudar a que el estudiante entienda con claridad como se separan las responsabilidades principales de la aplicacion:

- `main.js` inicia la app.
- `router/` gestiona navegacion y proteccion basica de rutas (lazy loading con `import()` dinamico).
- `views/` contiene las pantallas (home, login-register, dashboard, tasks, task-form, profile, admin, recovery, not-found).
- `components/` agrupa piezas reutilizables (nav, header, sidebar, kanban, task-list, comments, admin/user-card).
- `services/` maneja datos, sesion y backend fake (api, auth, session, task, comment, log, storage).
- `utils/` concentra helpers pequenos (crypto, dom, theme, toast, ui, export, password, filters).
- `styles/` organiza estilos globales y modo oscuro.

## Prioridades del repositorio

1. Mantener la aplicacion simple y entendible.
2. Separar vista, logica, estado y acceso a datos.
3. Evitar soluciones acopladas o dificiles de explicar.
4. Conservar una experiencia SPA fluida sin recargas completas.
5. Respetar roles, permisos y proteccion de rutas en cada cambio.

## Stack y restricciones

- JavaScript Vanilla con modulos ES.
- HTML y CSS.
- Tailwind CSS para la construccion de vistas y utilidades de interfaz.
- Vite como entorno de desarrollo.
- Backend fake con `json-server` (recursos: `users`, `tasks`, `comments`).
- No introducir React, Vue, Angular ni librerias que desplacen el objetivo pedagogico del proyecto.

## Principios de implementacion

- Cada modulo debe tener una responsabilidad clara.
- La manipulacion del DOM debe permanecer organizada y predecible.
- La logica de negocio no debe quedar incrustada en listeners o plantillas extensas.
- El acceso a `localStorage`, `sessionStorage` o APIs remotas debe envolverse en utilidades o servicios.
- Las validaciones de autenticacion y permisos deben centralizarse.

## Dominios funcionales

### Autenticacion

- Login y logout.
- Persistencia de sesion con `localStorage`.
- Restauracion de sesion al recargar desde `localStorage`.
- Edicion del perfil del usuario autenticado.
- Eliminacion de la propia cuenta.
- Recuperacion de contrasena (flujo simulado con token en consola).
- Contrasenas cifradas en almacenamiento (XOR + base64).

### Routing

- Navegacion con `History API`.
- Carga lazy de vistas con `import()` dinamico.
- Rutas publicas y privadas.
- Fallback 404.
- Guards antes del render (auth + role).

### Tareas

- Listado de tareas con vista lista (paginada) y vista kanban (drag & drop).
- Creacion, edicion y eliminacion.
- Filtros por estado y busqueda por texto.
- Ordenamiento por fecha de creacion, vencimiento o alfabetico.
- Comentarios por tarea (autor, fecha, contenido).
- Restriccion por propietario para usuarios `USER`.

### Administracion

- Solo accesible para `ADMIN`.
- Gestion de usuarios (cambiar rol, eliminar).
- Visualizacion global de tareas agrupadas por usuario.
- Estadisticas visuales (barras de progreso por estado).
- Log de actividad (acciones registradas con timestamp).
- Exportacion de datos (usuarios JSON/CSV, tareas JSON).

### UI / Experiencia

- Modo oscuro con toggle persistente en `localStorage`.
- Sidebar responsive con menu hamburguesa en mobile.
- Notificaciones toast (success, error, info, warning).
- Modales de confirmacion que reemplazan `window.confirm()`.
- Animaciones de transicion entre vistas.
- Boton ojo para mostrar/ocultar contrasena en todos los campos password.
- Indicador de nivel de seguridad (barra + checklist de requisitos).
- Confirmacion de contrasena con validacion en tiempo real.

## Roles base

### `ADMIN`

- Acceso total al sistema.
- Gestiona usuarios, visualiza todas las tareas, modifica roles.
- Ve estadisticas globales, log de actividad, exporta datos.

### `USER`

- Gestiona solo sus tareas.
- Ve solo informacion propia.
- Edita su propio perfil.
- Puede eliminar su propia cuenta.

## Convenciones sugeridas de estructura

```text
src/
  main.js
  router/
    index.js
  views/
    home.js
    login-register.js
    dashboard.js
    tasks.js
    task-form.js
    profile.js
    admin.js
    recovery.js
    not-found.js
  components/
    nav.js
    header.js
    sidebar.js
    kanban.js
    task-list.js
    comments.js
    admin/
      user-card.js
  services/
    api.js
    authService.js
    sessionService.js
    taskService.js
    commentService.js
    logService.js
    storage.js
  utils/
    crypto.js
    dom.js
    theme.js
    toast.js
    ui.js
    export.js
    password.js
    filters.js
  styles/
    global.css
```

## Criterios para nuevas contribuciones

- Antes de agregar codigo, identificar si pertenece a `router`, `views`, `components`, `services`, `utils` o `styles`.
- Si una pieza se reutiliza entre vistas, moverla a `components`.
- Si una funcion conoce endpoints, almacenamiento o fetch, moverla a `services`.
- Si una regla depende de autenticacion o permisos, evaluarla dentro del router o en una utilidad sencilla de autorizacion.
- No duplicar plantillas o logica cuando una abstraccion simple pueda resolverlo.

## Reglas de UI y renderizado

- Las vistas deben renderizarse dinamicamente en un contenedor raiz.
- La navegacion interna debe usar el router SPA, no recargas con enlaces tradicionales.
- Tailwind CSS es la base para construir las vistas, manteniendo una interfaz consistente y facil de escalar.
- Mantener la interfaz clara y consistente, priorizando legibilidad y estructura.
- Evitar mezclar estilos inline con logica salvo que exista una razon puntual.
- El modo oscuro debe respetar las clases de Tailwind y los overrides CSS en `global.css`.
- Los `alert()` y `confirm()` nativos deben reemplazarse por `showToast()` y `showConfirm()`.

## Datos y persistencia

- El backend fake sera la fuente principal de datos persistentes.
- `json-server` debe manejar recursos como `users`, `tasks` y `comments`.
- La sesion activa debe persistirse en `localStorage` para simplificar la autenticacion de esta primera SPA.
- El manejo de `localStorage` debe estar encapsulado en utilidades o servicios.
- No asumir permisos solo por ocultar botones; validar acceso tambien en guards y acciones.
- Las acciones sobre perfil deben limitarse al propio usuario, salvo privilegios administrativos explicitos.
- Las contrasenas deben almacenarse cifradas tanto en `localStorage` como en `db.json`.

## Calidad esperada

- Funciones pequenas y con nombres claros.
- Modulos cohesivos.
- Flujo de datos facil de seguir.
- Comentarios solo cuando aporten contexto real.
- Evitar codigo muerto y archivos multiproposito.

## Orden recomendado de construccion

1. Router SPA base.
2. Layout principal (nav + sidebar).
3. Modulo de autenticacion.
4. Manejo de sesion.
5. Guards de rutas.
6. CRUD de tareas.
7. Dashboard.
8. Panel administrativo.
9. Filtros, busqueda y ordenamiento.
10. Paginacion.
11. Vista kanban y drag & drop.
12. Comentarios.
13. Modo oscuro.
14. Toast y confirm modales.
15. Recuperacion de contrasena.
16. Log de actividad.
17. Exportacion de datos.
18. Carga lazy de vistas.
19. Ojo toggle en campos password.
20. Indicador de seguridad de contrasena.
21. Confirmacion de contrasena en tiempo real.
22. Modularizacion de archivos grandes en modulos pequenos.

## Que debe evitar un agente

- Introducir frameworks SPA.
- Resolver todo en un solo archivo.
- Acoplar vistas directamente a estructuras rigidas de datos.
- Saltarse validaciones de rol por simplicidad temporal.
- Romper la navegacion SPA usando recargas completas innecesarias.
- Usar `alert()` o `confirm()` nativos en lugar de `showToast()`/`showConfirm()`.
- Almacenar contrasenas en texto plano en `localStorage` o `db.json`.

## Definicion de exito

Una contribucion es correcta si ayuda a que `TaskFlowSPA` siga siendo una SPA modular, entendible y escalable, con autenticacion, rutas protegidas, roles claros y un CRUD de tareas coherente con los permisos de cada usuario.
