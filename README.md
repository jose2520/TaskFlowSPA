# TaskFlowSPA

TaskFlowSPA es una aplicacion web tipo SPA (Single Page Application) construida con JavaScript Vanilla, HTML, CSS y Tailwind CSS. Su objetivo es simular un sistema moderno de gestion de tareas y productividad mientras sirve como base practica para aprender arquitectura frontend sin depender de frameworks como React, Vue o Angular.

La aplicacion usa routing del lado del cliente con History API para navegar entre vistas sin recargar toda la pagina, integrando autenticacion, autorizacion por roles, proteccion de rutas, renderizado dinamico y persistencia de datos con `json-server` como backend fake.

La sesion activa del usuario se maneja con `localStorage`, mientras que `json-server` gestiona los datos persistentes (`users` y `tasks`) a traves de peticiones HTTP.

## Objetivo del proyecto

Este proyecto esta pensado para practicar fundamentos clave del desarrollo frontend moderno:

- Routing SPA.
- Arquitectura frontend modular.
- Separacion de responsabilidades.
- Manejo de estado basico.
- Guards y proteccion de rutas.
- Reutilizacion de componentes.
- Escalabilidad en Vanilla JS.

## Tipo de arquitectura

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

- JavaScript Vanilla
- HTML5
- CSS3
- Tailwind CSS
- Vite
- JSON Server como backend fake

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

## Roles iniciales

### `ADMIN`

- Puede gestionar usuarios.
- Puede visualizar todas las tareas.
- Puede modificar roles y permisos.
- Tiene acceso completo al sistema.

### `USER`

- Puede crear, editar y eliminar sus propias tareas.
- Puede visualizar solo la informacion relacionada con su cuenta.
- Puede editar su propio perfil.
- Puede eliminar su propia cuenta.

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

### Principios de arquitectura

- Cada modulo debe encargarse de una responsabilidad clara.
- Las vistas no deben contener toda la logica de negocio.
- El acceso al backend debe centralizarse en `services`.
- La logica de permisos debe aislarse en el sistema de routing o en utilidades de autorizacion.
- Los componentes compartidos deben ser reutilizables y faciles de identificar.
- Las vistas deben apoyarse en Tailwind CSS para mantener consistencia visual y velocidad de construccion.

## Flujo general de navegacion

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

- Un `USER` solo puede manipular sus propias tareas.
- Un `USER` solo puede editar su propio perfil.
- Un `USER` puede eliminar su propia cuenta.
- Un `ADMIN` puede ver y administrar todas las tareas y usuarios.
- Las rutas privadas no deben renderizarse si no existe una sesion valida.
- El estado de autenticacion debe persistirse de forma controlada en `localStorage`.

## Scripts disponibles

- `npm run dev`: levanta Vite y json-server simultaneamente.
- `npm run dev:vite`: solo Vite (sin backend fake).
- `npm run dev:server`: solo json-server en `http://localhost:3000`.
- `npm run build`: genera la version de produccion.
- `npm run preview`: sirve localmente el build generado.

## Inicio rapido

1. Instala dependencias:

```bash
npm install
```

2. Inicia la app en desarrollo (Vite + json-server se ejecutan simultaneamente):

```bash
npm run dev
```

3. Opcional: para ejecutar solo Vite o solo json-server por separado:

```bash
npm run dev:vite     # Solo Vite
npm run dev:server   # Solo json-server en http://localhost:3000
```

## Backend fake

La persistencia de datos del sistema esta basada en `json-server`, que sirve los recursos desde [`db.json`](./db.json):

- `users`
- `tasks`

El cliente HTTP se centraliza en `src/services/api.js`, que usa el prefijo `/api` y Vite lo proxyza a `http://localhost:3000`.

Responsabilidades del backend fake:

- CRUD completo de usuarios y tareas.
- Validacion de credenciales por consulta.
- Filtros por propietario y roles.
- Persistencia en disco a traves de `db.json`.

## Manejo de sesion

Para mantener el proyecto simple y enfocado en el aprendizaje:

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

## Licencia

Este proyecto se distribuye bajo la licencia incluida en [`LICENSE`](./LICENSE).
