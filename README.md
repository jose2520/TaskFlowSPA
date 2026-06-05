# TaskFlowSPA

TaskFlowSPA es una aplicación web SPA construida con JavaScript Vanilla, HTML, CSS y Tailwind CSS. Está diseñada como una plataforma práctica para aprender arquitectura frontend moderna sin depender de frameworks como React, Vue o Angular.

<<<<<<< HEAD
La aplicacion usa routing del lado del cliente con History API para navegar entre vistas sin recargar toda la pagina, integrando autenticacion, autorizacion por roles, proteccion de rutas, renderizado dinamico y persistencia de datos con `json-server` como backend fake.

La sesion activa del usuario se maneja con `localStorage`, mientras que `json-server` gestiona los datos persistentes (`users` y `tasks`) a traves de peticiones HTTP.
=======
Combina routing del lado del cliente con History API, rutas protegidas, roles de usuario, renderizado dinámico y persistencia de datos mediante un backend falso con `json-server`.

El flujo de sesión se maneja en el cliente con `localStorage`, y los recursos persistentes (`users`, `tasks` y `comments`) se almacenan en `json-server`.

## Contenido

- [Objetivo del proyecto](#objetivo-del-proyecto) 🎯
- [Estructura del proyecto](#estructura-del-proyecto) 📁
- [Stack principal](#stack-principal) 🧰
- [Funcionalidades clave](#funcionalidades-clave) ✨
- [Roles y permisos](#roles-y-permisos) 🛡️
- [Rutas principales](#rutas-principales) 🧭
- [Flujo de navegación](#flujo-de-navegación) 🔄
- [Datos de prueba y credenciales iniciales](#datos-de-prueba-y-credenciales-iniciales) 🧪
- [Backend falso y proxy](#backend-falso-y-proxy) 🌐
- [Scripts disponibles](#scripts-disponibles) ⚙️
- [Inicio rápido](#inicio-rápido) 🚀
- [Manejo de sesión](#manejo-de-sesión) 🔐
- [Arquitectura de servicios](#arquitectura-de-servicios) 🧩
- [Criterios del proyecto](#criterios-del-proyecto) ✅
- [Estado actual](#estado-actual) 📈
- [Licencia](#licencia) 📝
>>>>>>> 697fb27 (update)

## Objetivo del proyecto

Crear una SPA modular y educativa que muestre:

- Routing SPA con protección de rutas.
- Arquitectura frontend clara y por capas.
- Separación de responsabilidades entre vistas, servicios y utilidades.
- Persistencia de sesión y datos mediante `localStorage` y un backend falso.
- Gestión de usuarios, tareas y permisos de acceso.

## Estructura del proyecto 📁

<<<<<<< HEAD
<<<<<<< HEAD
El proyecto usa una arquitectura frontend simple por capas (`layered architecture`) adaptada a una SPA en JavaScript Vanilla, separando por responsabilidades:

```
src/
  main.js            Punto de arranque
  router/            Navegacion SPA y guards de rutas
  views/             Pantallas de la aplicacion
  components/        Piezas reutilizables (nav)
  services/          Comunicacion con el backend (api, auth, tasks, storage)
  utils/             Funciones auxiliares (DOM)
  styles/            Estilos globales (Tailwind CSS + animaciones)

db.json              Datos persistentes del backend fake (json-server)
```

## Stack principal
=======
La estructura principal está organizada para separar interfaz, navegación, lógica de negocio y datos:
=======
22 módulos distribuidos en 6 capas:
>>>>>>> 67ec89a (update)

```
TaskFlowSPA/
├── index.html                        📄 Entrada HTML
├── package.json                      📦 Vite + Tailwind v4 + json-server
├── vite.config.ts                    ⚙️  Proxy /api → localhost:3000
├── db.json                           💾 Datos fake (users, tasks, comments)
│
└── src/  (~2478 lns, build ~82ms)   📂
    ├── main.js                       🧩 (6 lns)   Arranque (theme + router)
    │
    ├── router/
    │   └── index.js                  🚦 (150 lns)  History API, lazy import(), guards
    │
    ├── components/
    │   ├── nav.js                    🧭 (68 lns)   Orquestación nav + sidebar
    │   ├── header.js                 🧩 (55 lns)   Header público y autenticado
    │   ├── sidebar.js                📱 (65 lns)   Sidebar responsive + open/close
    │   ├── kanban.js                 📋 (111 lns)  Kanban board + drag & drop
    │   ├── task-list.js              📋 (112 lns)  Lista tareas + paginación
    │   ├── comments.js               💬 (52 lns)   Cargar/enviar comentarios
    │   └── admin/
    │       └── user-card.js          🃏 (44 lns)   Card usuario con tareas
    │
    ├── views/
    │   ├── admin.js                  🛠️  (209 lns) Stats, log, export, gestión users
    │   ├── dashboard.js              📊 (60 lns)   Métricas de tareas
    │   ├── home.js                   🏠 (42 lns)   Landing page
    │   ├── login-register.js         🔐 (289 lns)  Auth, ojo, fuerza, confirmar
    │   ├── not-found.js              ❓ (15 lns)   404
    │   ├── profile.js                👤 (101 lns)  Editar perfil, eliminar cuenta
    │   ├── recovery.js               🔁 (136 lns)  Recuperación de contraseña
    │   ├── task-form.js              ✍️ (128 lns)  Crear/editar + comentarios
    │   └── tasks.js                  📋 (112 lns)  Lista, kanban, filtros, paginación
    │
    ├── services/
    │   ├── api.js                    🌐 (32 lns)   Fetch wrapper
    │   ├── authService.js            🛡️ (84 lns)   Login, register, profile, admin
    │   ├── sessionService.js         🔑 (33 lns)   Sesión (get/save/logout)
    │   ├── taskService.js            ✅ (59 lns)   CRUD tareas
    │   ├── commentService.js         💬 (16 lns)   Comentarios por tarea
    │   ├── logService.js             📝 (25 lns)   Actividad en localStorage
    │   └── storage.js                💾 (20 lns)   get/set/remove local data
    │
    ├── utils/
    │   ├── crypto.js                 🔐 (23 lns)   XOR + base64
    │   ├── dom.js                    🔀 (25 lns)   goTo, escapeHtml, togglePassword
    │   ├── theme.js                  🌓 (28 lns)   Dark mode toggle + persistencia
    │   ├── toast.js                  🔔 (67 lns)   Notificaciones + confirm modal
    │   ├── ui.js                     🏷️  (8 lns)   statusBadge()
    │   ├── export.js                 📥 (24 lns)   JSON/CSV download
    │   ├── password.js               🔒 (58 lns)   Strength bar + checklist
    │   └── filters.js                🔍 (26 lns)   applyFiltersAndSort()
    │
    └── styles/
        └── global.css                🎨 (195 lns)  Tailwind v4, dark overrides, animaciones
```

## Stack principal 🧰
>>>>>>> 697fb27 (update)

- JavaScript Vanilla
- HTML5
- CSS3
- Tailwind CSS
- Vite
- JSON Server

<<<<<<< HEAD
## Funcionalidades implementadas

- Inicio de sesion, registro y cierre de sesion en vista unificada con paneles deslizantes animados.
- Manejo de sesion con `localStorage`.
- Rutas publicas y privadas con guards.
- Sistema de roles (`ADMIN` / `USER`) y permisos.
- Navegacion SPA con `History API` y transiciones animadas.
- Renderizado dinamico de vistas sin recarga.
- Componente de navegacion reutilizable.
- CRUD completo de tareas con filtro por propietario.
- Edicion de perfil del usuario autenticado.
- Eliminacion de la propia cuenta.
- Dashboard con estadisticas de tareas.
- Panel administrativo para usuarios `ADMIN`.
- Backend fake con `json-server` y persistencia en disco.
=======
## Funcionalidades clave ✨

<<<<<<< HEAD
- 🔐 Login, registro y logout con una interfaz unificada.
- 💾 Persistencia de sesión en `localStorage`.
- 🚧 Rutas públicas y privadas con guards.
- 👥 Sistema de roles (`ADMIN` / `USER`).
- 🌐 Navegación SPA sin recargas completas.
- 📋 CRUD de tareas con filtros de propietario.
- 🧑‍💼 Edición de perfil y eliminación de cuenta de usuario.
- 📊 Dashboard con estadísticas de tareas.
- 🛡️ Panel administrativo accesible solo para `ADMIN`.
- 🧪 Backend falso con `json-server` y persistencia en `db.json`.
>>>>>>> 697fb27 (update)
=======
- **Autenticación** — Login, registro y logout con interfaz unificada y animaciones.
- **Recuperación de contraseña** — Flujo simulado con token, enlace en consola.
- **Roles** — Sistema `ADMIN` / `USER` con guards en rutas y vistas.
- **CRUD de tareas** — Crear, editar, eliminar con permisos por propietario.
- **Filtros y búsqueda** — Filtrar por estado, buscar por título/descripción.
- **Ordenamiento** — Por fecha de creación, vencimiento o alfabético.
- **Paginación** — 5 tareas por página con navegación.
- **Vista kanban** — Tablero con 3 columnas y drag & drop entre estados.
- **Comentarios** — Sección de comentarios por tarea con autor y fecha.
- **Dashboard** — Métricas de tareas (totales, pendientes, en progreso, completadas).
- **Panel admin** — Gestión de usuarios, cambio de roles, eliminación.
- **Estadísticas admin** — Barras de progreso y contadores globales.
- **Log de actividad** — Registro de acciones (crear, editar, eliminar, cambiar rol).
- **Exportación de datos** — Descargar usuarios (JSON/CSV) y tareas (JSON).
- **Perfil** — Editar nombre, email, contraseña y eliminar cuenta propia.
- **Modo oscuro** — Toggle persistente en localStorage.
- **Sidebar responsive** — Menú hamburguesa en mobile con overlay.
- **Carga lazy** — Cada vista se carga bajo demanda con `import()` dinámico.
- **Cifrado** — Contraseñas cifradas en localStorage y db.json.
- **Transiciones** — Animaciones slide entre vistas y en autenticación.
>>>>>>> 67ec89a (update)

## Roles y permisos 🛡️

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

<<<<<<< HEAD
## Modulos y vistas

La SPA incluye las siguientes vistas:

- `/` — Landing page (Home)
- `/login` y `/register` — Vista combinada de autenticacion con panel deslizante animado
- `/dashboard` — Resumen con estadisticas de tareas
- `/tasks` — Listado de tareas del usuario
- `/tasks/create` — Formulario para crear tarea
- `/tasks/edit/:id` — Formulario para editar tarea
- `/profile` — Edicion de perfil y eliminacion de cuenta
- `/admin` — Panel administrativo (solo `ADMIN`)
- `/404` — Pagina no encontrada
=======
## Rutas principales 🧭

- `/` — Home
- `/login` y `/register` — Autenticación
- `/recovery` y `/recovery/:token` — Recuperación de contraseña
- `/dashboard` — Panel principal con métricas
- `/tasks` — Listado de tareas (vista lista o kanban)
- `/tasks/create` — Crear tarea
- `/tasks/edit/:id` — Editar tarea (con comentarios)
- `/profile` — Perfil de usuario
- `/admin` — Panel administrativo (solo `ADMIN`)
- `/404` — Página no encontrada

## Flujo de navegación 🔄

1. El usuario abre la aplicación.
2. Si no está autenticado, se redirige a login.
3. Al iniciar sesión, la sesión se guarda en `localStorage`.
4. El router valida la sesión y los permisos antes de renderizar cada vista.
5. Al recargar, la sesión se restaura automáticamente.
6. El acceso a `/admin` requiere rol `ADMIN`.
7. Al hacer logout, se borra la sesión del almacenamiento local.

## Datos de prueba y credenciales iniciales 🧪

Al iniciar la aplicación con `npm run dev`, `json-server` carga los datos de [`db.json`](./db.json).
>>>>>>> 697fb27 (update)

**Usuarios predefinidos:**

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@taskflow.com` | `admin123` | ADMIN |
| `user@taskflow.com` | `user123` | USER |

**Tareas de ejemplo:** varias tareas iniciales con estados como `pending`, `in-progress` y `completed`.

<<<<<<< HEAD
1. El usuario entra a la aplicacion.
2. Si no tiene sesion activa, ve la vista de `login`.
3. Tras autenticarse, la sesion se guarda en `localStorage` y se redirige al `dashboard`.
4. El router valida sesion y rol antes de renderizar cada vista.
5. Al recargar la app, la sesion se restaura desde `localStorage`.
6. Las rutas administrativas validan autenticacion y rol `ADMIN`.
7. Al cerrar sesion, los datos de sesion se eliminan del `localStorage`.

## Datos de prueba

Al iniciar la app con `npm run dev`, json-server carga los datos semilla de [`db.json`](./db.json):

**Usuarios predefinidos:**

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| `admin@taskflow.com` | `admin123` | ADMIN |
| `user@taskflow.com` | `user123` | USER |

**Tareas predefinidas:** 3 tareas de ejemplo repartidas entre ambos usuarios con distintos estados (pending, in-progress, completed).

> Si necesitas empezar desde cero, solo elimina `db.json` y vuelve a ejecutar `npm run dev` — json-server lo recreara automaticamente con los datos iniciales.

## Reglas de negocio base
=======
> Si deseas empezar desde cero, elimina `db.json` y vuelve a ejecutar `npm run dev`; `json-server` recreará el archivo automáticamente.

<<<<<<< HEAD
## Backend falso y proxy
>>>>>>> 697fb27 (update)
=======
## Backend falso y proxy 🌐
>>>>>>> 67ec89a (update)

El backend falso expone los recursos:

- `users`
- `tasks`
- `comments`

El cliente HTTP está centralizado en `src/services/api.js`, que llama a rutas bajo `/api`. Vite proxya `/api` a `http://localhost:3000` mediante la configuración en `vite.config.ts`.

## Scripts disponibles ⚙️

<<<<<<< HEAD
- `npm run dev`: levanta Vite y json-server simultaneamente.
- `npm run dev:vite`: solo Vite (sin backend fake).
- `npm run dev:server`: solo json-server en `http://localhost:3000`.
- `npm run build`: genera la version de produccion.
- `npm run preview`: sirve localmente el build generado.
=======
- `npm run dev` — Inicia Vite y `json-server` juntos.
- `npm run dev:vite` — Inicia solo Vite.
- `npm run dev:server` — Inicia solo `json-server` en `http://localhost:3000`.
- `npm run build` — Genera la versión de producción.
- `npm run preview` — Sirve el build generado.
>>>>>>> 697fb27 (update)

## Inicio rápido 🚀

1. Instala dependencias:

```bash
npm install
```

<<<<<<< HEAD
2. Inicia la app en desarrollo (Vite + json-server se ejecutan simultaneamente):
=======
2. Inicia la aplicación en desarrollo:
>>>>>>> 697fb27 (update)

```bash
npm run dev
```

<<<<<<< HEAD
3. Opcional: para ejecutar solo Vite o solo json-server por separado:

```bash
npm run dev:vite     # Solo Vite
npm run dev:server   # Solo json-server en http://localhost:3000
```
=======
3. Para ejecutar solo uno de los servicios:
>>>>>>> 697fb27 (update)

```bash
npm run dev:vite
npm run dev:server
```

<<<<<<< HEAD
<<<<<<< HEAD
La persistencia de datos del sistema esta basada en `json-server`, que sirve los recursos desde [`db.json`](./db.json):
=======
## Manejo de sesión
>>>>>>> 697fb27 (update)
=======
## Manejo de sesión 🔐
>>>>>>> 67ec89a (update)

- La sesión activa se guarda en `localStorage`.
- No existe una colección de sesiones en el backend.
- El backend falso gestiona solo `users`, `tasks` y `comments`.
- El frontend restaura la sesión automáticamente al recargar.
- Las contraseñas se almacenan cifradas tanto en `localStorage` como en `db.json`.

<<<<<<< HEAD
<<<<<<< HEAD
El cliente HTTP se centraliza en `src/services/api.js`, que usa el prefijo `/api` y Vite lo proxyza a `http://localhost:3000`.

Responsabilidades del backend fake:

- CRUD completo de usuarios y tareas.
- Validacion de credenciales por consulta.
- Filtros por propietario y roles.
- Persistencia en disco a traves de `db.json`.
=======
## Arquitectura de servicios

La comunicación con el backend se realiza con una capa de API reutilizable en `src/services/api.js`. Los servicios de dominio (`authService.js`, `taskService.js`) usan esta capa y no llaman a `fetch` directamente.
>>>>>>> 697fb27 (update)
=======
## Arquitectura de servicios 🧩

La comunicación con el backend se realiza con una capa de API reutilizable en `src/services/api.js`. Los servicios de dominio (`authService.js`, `taskService.js`, `commentService.js`, `logService.js`) usan esta capa y no llaman a `fetch` directamente.
>>>>>>> 67ec89a (update)

```
Vistas → authService / taskService / commentService → api.js → /api/* → Vite proxy → json-server
```

## Criterios del proyecto ✅

<<<<<<< HEAD
- `json-server` gestiona `users` y `tasks`.
- `localStorage` guarda unicamente la sesion activa.
- No existe una coleccion `sessions` en el backend fake.

Esto permite practicar autenticacion SPA sin agregar complejidad innecesaria.

## Capa de servicios y API

La comunicacion con json-server se centraliza en `src/services/api.js`, que expone los metodos `get`, `post`, `patch` y `delete`. Los servicios de dominio (`authService.js`, `taskService.js`) usan esta capa y nunca llaman a `fetch` directamente.

```
Vistas → authService / taskService → api.js → /api/* → Vite proxy → json-server (puerto 3000)
```

La sesion del usuario se persiste en `localStorage` (clave `taskflowspa_session`) para mantener la autenticacion al recargar la pagina, mientras que los datos de usuarios y tareas se gestionan via json-server.

## Criterios tecnicos del proyecto

- Sin frameworks SPA (React, Vue, Angular).
- Arquitectura simple por capas.
- DOM, logica de negocio y acceso a datos separados en modulos distintos.
- Codigo legible, escalable y facil de mantener.

## Estado actual

La SPA esta completamente funcional con las siguientes caracteristicas implementadas:

1. Router SPA con History API y scroll-to-top.
2. Layout base con navegacion reactiva.
3. Autenticacion combinada (login/registro) con paneles deslizantes animados.
4. Guards de rutas (auth + rol ADMIN).
5. CRUD completo de tareas.
6. Dashboard con estadisticas y manejo de errores.
7. Panel administrativo (gestion de usuarios y roles).
8. Backend fake con json-server (persistencia en db.json).
9. Sanitizacion de datos de usuario en vistas.
10. Estados de carga en formularios (login, registro, creacion/edicion de tareas, perfil).
=======
- Sin frameworks SPA.
- Arquitectura simple y por capas.
- Lógica de negocio separada de la presentación.
- Componentes reutilizables.
- Código legible y fácil de mantener.

## Estado actual 📈

La SPA está funcional y cuenta con:

<<<<<<< HEAD
1. Router SPA con History API.
2. Navegación protegida y rol-based guards.
3. Autenticación y registro en una sola pantalla.
4. CRUD de tareas.
5. Dashboard de métricas.
6. Panel administrativo para `ADMIN`.
7. Persistencia de datos con `json-server`.
8. Sesión persistente en `localStorage`.
>>>>>>> 697fb27 (update)
=======
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
13. Persistencia de datos con `json-server`.
14. Botón ojo (mostrar/ocultar) en campos de contraseña.
15. Confirmación de contraseña con validación en tiempo real.
16. Indicador de nivel de seguridad + checklist de requisitos.
>>>>>>> 67ec89a (update)

## Licencia 📝

Este proyecto se distribuye bajo la licencia incluida en [`LICENSE`](./LICENSE).
