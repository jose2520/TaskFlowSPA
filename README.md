# TaskFlowSPA

TaskFlowSPA es una aplicación web SPA construida con JavaScript Vanilla, HTML, CSS y Tailwind CSS. Está diseñada como una plataforma práctica para aprender arquitectura frontend moderna sin depender de frameworks como React, Vue o Angular.

<<<<<<< HEAD
La aplicacion usa routing del lado del cliente con History API para navegar entre vistas sin recargar toda la pagina, integrando autenticacion, autorizacion por roles, proteccion de rutas, renderizado dinamico y persistencia de datos con `json-server` como backend fake.

La sesion activa del usuario se maneja con `localStorage`, mientras que `json-server` gestiona los datos persistentes (`users` y `tasks`) a traves de peticiones HTTP.
=======
Combina routing del lado del cliente con History API, rutas protegidas, roles de usuario, renderizado dinámico y persistencia de datos mediante un backend falso con `json-server`.

El flujo de sesión se maneja en el cliente con `localStorage`, y los recursos persistentes (`users` y `tasks`) se almacenan en `json-server`.

## Contenido

- [Objetivo del proyecto](#objetivo-del-proyecto) 🎯
- [Estructura del proyecto](#estructura-del-proyecto) 📁
- [Stack principal](#stack-principal) 🧰
- [Funcionalidades clave](#funcionalidades-clave) ✨
- [Roles y permisos](#roles-y-permisos) 🛡️
- [Rutas principales](#rutas-principales) 🧭
- [Flujo de navegación](#flujo-de-navegación) 🔄
- [Datos de prueba](#datos-de-prueba-y-credenciales-iniciales) 🧪
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

```
.
├─ src/                📂
│  ├─ main.js          🧩 Punto de entrada de la aplicación
│  ├─ router/          🚦 Navegación SPA y guards de rutas
│  ├─ views/           🖼️ Pantallas de la aplicación
│  ├─ components/      🧱 Componentes reutilizables (navigation, formularios)
│  ├─ services/        🛠️ Lógica de negocio y acceso a API falso
│  ├─ utils/           🔧 Utilidades de DOM y helpers pequeños
│  └─ styles/          🎨 Estilos globales y configuración de Tailwind
└─ db.json            💾 Datos persistentes del backend falso
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

## Roles y permisos 🛡️

### `ADMIN`

- Gestiona usuarios.
- Visualiza todas las tareas.
- Accede al panel administrativo.
- Puede ver y administrar datos globales.

### `USER`

- Gestiona solo sus propias tareas.
- Ve solo su información y tareas asociadas.
- Edita su propio perfil.
- Elimina su propia cuenta.

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
- `/dashboard` — Panel principal con métricas
- `/tasks` — Listado de tareas
- `/tasks/create` — Crear tarea
- `/tasks/edit/:id` — Editar tarea
- `/profile` — Perfil de usuario
- `/admin` — Panel administrativo (`ADMIN`)
- `/404` — Página no encontrada

## Flujo de navegación 🔄

1. El usuario abre la aplicación.
2. Si no está autenticado, se redirige a login.
3. Al iniciar sesión, la sesión se guarda en `localStorage`.
4. El router valida la sesión y los permisos antes de renderizar cada vista.
5. Al recargar, la sesión se restaura automáticamente.
6. El acceso a `/admin` requiere rol `ADMIN`.
7. Al hacer logout, se borra la sesión del almacenamiento local.

## Datos de prueba y credenciales iniciales

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

## Backend falso y proxy
>>>>>>> 697fb27 (update)

El backend falso expone los recursos:

- `users`
- `tasks`

El cliente HTTP está centralizado en `src/services/api.js`, que llama a rutas bajo `/api`. Vite proxya `/api` a `http://localhost:3000` mediante la configuración en `vite.config.ts`.

## Scripts disponibles

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

## Inicio rápido

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
La persistencia de datos del sistema esta basada en `json-server`, que sirve los recursos desde [`db.json`](./db.json):
=======
## Manejo de sesión
>>>>>>> 697fb27 (update)

- La sesión activa se guarda en `localStorage`.
- No existe una colección de sesiones en el backend.
- El backend falso gestiona solo `users` y `tasks`.
- El frontend restaura la sesión automáticamente al recargar.

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

```
Vistas → authService / taskService → api.js → /api/* → Vite proxy → json-server
```

## Criterios del proyecto

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

## Estado actual

La SPA está funcional y cuenta con:

1. Router SPA con History API.
2. Navegación protegida y rol-based guards.
3. Autenticación y registro en una sola pantalla.
4. CRUD de tareas.
5. Dashboard de métricas.
6. Panel administrativo para `ADMIN`.
7. Persistencia de datos con `json-server`.
8. Sesión persistente en `localStorage`.
>>>>>>> 697fb27 (update)

## Licencia

Este proyecto se distribuye bajo la licencia incluida en [`LICENSE`](./LICENSE).
