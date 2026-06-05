# TaskFlowSPA

TaskFlowSPA es una aplicación web SPA construida con JavaScript Vanilla, HTML, CSS y Tailwind CSS. Diseñada como plataforma educativa para aprender arquitectura frontend moderna sin frameworks SPA (React, Vue, Angular).

Usa routing del lado del cliente con History API, autenticación con roles, rutas protegidas, renderizado dinámico y `json-server` como backend fake.

## Contenido

- [Objetivo del proyecto](#objetivo-del-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Stack principal](#stack-principal)
- [Funcionalidades clave](#funcionalidades-clave)
- [Roles y permisos](#roles-y-permisos)
- [Rutas principales](#rutas-principales)
- [Flujo de navegación](#flujo-de-navegacion)
- [Datos de prueba y credenciales iniciales](#datos-de-prueba-y-credenciales-iniciales)
- [Backend falso y proxy](#backend-falso-y-proxy)
- [Scripts disponibles](#scripts-disponibles)
- [Inicio rápido](#inicio-rapido)
- [Arquitectura de servicios](#arquitectura-de-servicios)
- [Criterios del proyecto](#criterios-del-proyecto)
- [Estado actual](#estado-actual)
- [Licencia](#licencia)

## Objetivo del proyecto

Crear una SPA modular y educativa que muestre:

- Routing SPA con protección de rutas.
- Arquitectura frontend clara y por capas.
- Separación de responsabilidades entre vistas, servicios y utilidades.
- Persistencia de sesión y datos mediante `localStorage` y un backend falso.
- Gestión de usuarios, tareas y permisos de acceso.

## Estructura del proyecto

```
src/
  main.js            Punto de arranque (inicia tema y router)
  router/            Navegación SPA, guards de rutas, lazy loading
  views/             Pantallas de la aplicación (home, login, tasks, admin...)
  components/        Piezas reutilizables (nav, header, sidebar, kanban, comments...)
  services/          Comunicación con backend y lógica de datos (api, auth, task, storage...)
  utils/             Funciones auxiliares (crypto, dom, theme, toast, export...)
  styles/            Estilos globales (Tailwind CSS + animaciones)

db.json              Datos persistentes del backend fake (json-server)
```

### Módulos por capa

```
src/
├── main.js                       Arranque (theme + router)
├── router/
│   └── index.js                  History API, lazy import(), guards auth/rol
├── components/
│   ├── nav.js                    Orquestación nav + sidebar
│   ├── header.js                 Header público y autenticado
│   ├── sidebar.js                Sidebar responsive + open/close
│   ├── kanban.js                 Kanban board + drag & drop
│   ├── task-list.js              Lista de tareas + paginación
│   ├── comments.js               Cargar/enviar comentarios
│   └── admin/
│       └── user-card.js          Card de usuario con tareas
├── views/
│   ├── admin.js                  Stats, log, export, gestión de usuarios
│   ├── dashboard.js              Métricas de tareas
│   ├── home.js                   Landing page
│   ├── login-register.js         Auth, toggle password, fuerza, confirmación
│   ├── not-found.js              404
│   ├── profile.js                Editar perfil, eliminar cuenta
│   ├── recovery.js               Recuperación de contraseña
│   ├── task-form.js              Crear/editar tarea + comentarios
│   └── tasks.js                  Lista, kanban, filtros, paginación
├── services/
│   ├── api.js                    Fetch wrapper (get, post, patch, delete)
│   ├── authService.js            Login, register, profile, admin
│   ├── sessionService.js         Sesión (get/save/logout)
│   ├── taskService.js            CRUD tareas
│   ├── commentService.js         Comentarios por tarea
│   ├── logService.js             Actividad en localStorage
│   └── storage.js                get/set/remove datos locales
├── utils/
│   ├── crypto.js                 XOR + base64
│   ├── dom.js                    goTo, escapeHtml, togglePasswordVisibility
│   ├── theme.js                  Dark mode toggle + persistencia
│   ├── toast.js                  Notificaciones + confirm modal + format picker
│   ├── ui.js                     statusBadge()
│   ├── export.js                 Descarga JSON/CSV
│   ├── password.js               Strength bar + checklist
│   └── filters.js                applyFiltersAndSort()
└── styles/
    └── global.css                Tailwind v4, dark overrides, animaciones
```

## Stack principal

- JavaScript Vanilla (ES Modules)
- HTML5 / CSS3
- Tailwind CSS v4
- Vite (entorno de desarrollo y build)
- JSON Server (backend fake)

## Funcionalidades clave

- **Autenticación** — Login, registro y logout con interfaz unificada de paneles deslizantes animados.
- **Recuperación de contraseña** — Flujo simulado con token y enlace en consola.
- **Roles** — Sistema `ADMIN` / `USER` con guards en rutas y vistas.
- **CRUD de tareas** — Crear, editar, eliminar con permisos por propietario.
- **Filtros y búsqueda** — Filtrar por estado, buscar por título/descripción.
- **Ordenamiento** — Por fecha de creación, vencimiento o alfabético.
- **Paginación** — 5 tareas por página con navegación.
- **Vista kanban** — Tablero con 3 columnas y drag & drop entre estados.
- **Comentarios** — Sección de comentarios por tarea con autor y fecha.
- **Dashboard** — Métricas de tareas (totales, pendientes, en progreso, completadas).
- **Panel admin** — Gestión de usuarios, cambio de roles, estadísticas, log y exportación.
- **Perfil** — Editar nombre, email, contraseña y eliminar cuenta propia.
- **Modo oscuro** — Toggle persistente en localStorage.
- **Sidebar responsive** — Menú hamburguesa en mobile con overlay.
- **Carga lazy** — Cada vista se carga bajo demanda con `import()` dinámico.
- **Cifrado** — Contraseñas cifradas (XOR + base64) en localStorage y db.json.
- **Notificaciones** — Toast (success/error/info/warning) y modales de confirmación.
- **Seguridad visual** — Botón ojo en campos password, indicador de fortaleza, confirmación en tiempo real.
- **Transiciones** — Animaciones entre vistas y en paneles de autenticación.

## Roles y permisos

### `ADMIN`

- Acceso total al sistema.
- Gestiona usuarios (cambiar rol, eliminar).
- Visualiza todas las tareas de todos los usuarios.
- Ve estadísticas globales y log de actividad.
- Exporta datos del sistema.
- Edita/elimina cualquier tarea.

### `USER`

- Gestiona solo sus propias tareas.
- Ve solo su información y tareas asociadas.
- Edita su propio perfil.
- Elimina su propia cuenta.
- No accede al panel administrativo.

## Rutas principales

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Home | Público |
| `/login` | Login | Público |
| `/register` | Registro | Público |
| `/recovery` | Solicitar recuperación | Público |
| `/recovery/:token` | Restablecer contraseña | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/tasks` | Listado de tareas | Autenticado |
| `/tasks/create` | Crear tarea | Autenticado |
| `/tasks/edit/:id` | Editar tarea | Autenticado (propietario o admin) |
| `/profile` | Perfil de usuario | Autenticado |
| `/admin` | Panel administrativo | ADMIN |
| `/404` | Página no encontrada | Público |

## Flujo de navegación

1. El usuario abre la aplicación.
2. Si no está autenticado, ve la vista de login.
3. Tras autenticarse, la sesión se guarda en `localStorage` y se redirige al dashboard.
4. El router valida sesión y rol antes de renderizar cada vista.
5. Al recargar la app, la sesión se restaura desde `localStorage`.
6. Las rutas administrativas validan autenticación y rol `ADMIN`.
7. Al cerrar sesión, los datos de sesión se eliminan del `localStorage`.

## Datos de prueba y credenciales iniciales

Al iniciar la app con `npm run dev`, json-server carga los datos semilla de [`db.json`](./db.json).

### Usuarios predefinidos

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@taskflow.com` | `admin123` | ADMIN |
| `user@taskflow.com` | `user123` | USER |

### Tareas de ejemplo

Varias tareas iniciales repartidas entre ambos usuarios con estados `pending`, `in-progress` y `completed`.

> Si necesitas empezar desde cero, elimina `db.json` y vuelve a ejecutar `npm run dev`; json-server lo recreará automáticamente.

## Backend falso y proxy

El backend fake expone los recursos `users`, `tasks` y `comments` a través de json-server en `http://localhost:3000`.

El cliente HTTP está centralizado en `src/services/api.js`, que llama a rutas bajo `/api`. Vite proxya `/api` a `http://localhost:3000` mediante la configuración en `vite.config.ts`.

```
Vistas → authService / taskService / commentService → api.js → /api/* → Vite proxy → json-server
```

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia Vite y json-server simultáneamente |
| `npm run dev:vite` | Solo Vite (sin backend fake) |
| `npm run dev:server` | Solo json-server en `http://localhost:3000` |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Sirve localmente el build generado |

## Inicio rápido

```bash
# 1. Instala dependencias
npm install

# 2. Inicia la app en desarrollo (Vite + json-server)
npm run dev

# 3. Opcional: ejecutar servicios por separado
npm run dev:vite     # Solo Vite
npm run dev:server   # Solo json-server en http://localhost:3000
```

## Arquitectura de servicios

La comunicación con el backend se realiza con una capa de API reutilizable en `src/services/api.js`. Los servicios de dominio (`authService.js`, `taskService.js`, `commentService.js`, `logService.js`) usan esta capa y no llaman a `fetch` directamente.

La sesión activa se guarda en `localStorage` (clave `taskflowspa_session`). No existe una colección de sesiones en el backend. El backend fake gestiona solo `users`, `tasks` y `comments`. Las contraseñas se almacenan cifradas tanto en `localStorage` como en `db.json`.

## Criterios del proyecto

- Sin frameworks SPA (React, Vue, Angular).
- Arquitectura simple por capas.
- DOM, lógica de negocio y acceso a datos separados en módulos distintos.
- Código legible, escalable y fácil de mantener.

## Estado actual

La SPA está completamente funcional con las siguientes características implementadas:

1. Router SPA con History API y carga lazy de vistas.
2. Navegación protegida con guards basados en autenticación y roles.
3. Autenticación, registro y recuperación de contraseña.
4. CRUD de tareas con filtros, búsqueda, ordenamiento y paginación.
5. Vista kanban con drag & drop para cambiar estados.
6. Comentarios en tareas.
7. Dashboard de métricas.
8. Panel administrativo con estadísticas, log de actividad y exportación de datos.
9. Modo oscuro con persistencia.
10. Sidebar responsive para mobile.
11. Contraseñas cifradas en almacenamiento (XOR + base64).
12. Notificaciones toast y modales de confirmación.
13. Persistencia de datos con json-server.
14. Botón ojo (mostrar/ocultar) en campos de contraseña.
15. Confirmación de contraseña con validación en tiempo real.
16. Indicador de nivel de seguridad + checklist de requisitos.

## Licencia

Este proyecto se distribuye bajo la licencia incluida en [`LICENSE`](./LICENSE).
