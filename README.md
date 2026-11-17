# Proyecto Integrador Web - EventApp

Aplicación web para la gestión de eventos y reservas, desarrollada para el Proyecto Integrador de Bases de Datos y Programación en Ambiente Web I (UCEVA). Permite que clientes, agentes y administradores trabajen con información real almacenada en PostgreSQL.

## Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | Angular 20, TypeScript, HTML5, SCSS, Bootstrap y Bootstrap Icons |
| Backend | Node.js, Express 5, TypeScript, pg (node-postgres) |
| Base de datos | PostgreSQL 15 en Docker, con la extensión pgcrypto |

## Estructura del repositorio

```
Backend/
├── docker-compose.yml          # PostgreSQL y pgAdmin
├── .env                        # Variables de conexión
└── src/
    ├── config/                 # Conexión a la base de datos y variables de entorno
    ├── database/               # init.sql (tablas) y seed.sql (datos de ejemplo)
    ├── domain/                 # Modelos (interfaces), errores y validaciones
    └── presentation/
        ├── routes.ts           # Registro de todas las rutas bajo /api
        └── modules/            # location, persons, events, reservations, auth, reports
                                # Cada módulo: routes, controller y service

Frontend/
└── src/app/
    ├── components/             # navbar y event-card
    ├── guards/                 # Restricción de rutas por rol
    ├── interfaces/             # Modelos de datos
    ├── pages/                  # Las 11 páginas
    ├── services/               # Servicios HTTP hacia la API
    └── utils/                  # Manejo de errores, fechas y estilos de estado
```

## Requisitos previos

- Node.js 20 o superior
- Docker Desktop (debe estar encendido)
- Angular CLI (`npm install -g @angular/cli`), opcional si se usa `npm start`

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/johngonzalez02/Proyecto-Integrador-Web.git
cd Proyecto-Integrador-Web
```

### 2. Base de datos y backend

```bash
cd Backend
docker compose up -d
npm install
npm run db:init
npm run db:seed
npm start
```

- `docker compose up -d` levanta PostgreSQL en el puerto **5433** (usuario `user`, contraseña `123456`, base `proyecto-integrador-db`). Conviene esperar unos 10 segundos antes de continuar.
- `npm run db:init` crea las tablas.
- `npm run db:seed` inserta los datos de ejemplo.
- `npm start` levanta la API en **http://localhost:3000/api**.

Las variables de conexión están en `Backend/.env`.

#### Reiniciar la base de datos

El seed no se puede ejecutar dos veces seguidas (hay campos únicos, como el correo). Para empezar de cero:

```bash
cd Backend
docker compose down
rm -rf postgres        # en PowerShell: Remove-Item -Recurse -Force postgres
docker compose up -d
npm run db:init
npm run db:seed
```

### 3. Frontend

En otra terminal:

```bash
cd Frontend
npm install
npm start
```

La aplicación queda en **http://localhost:4200**. La dirección de la API está en `Frontend/src/app/config/api.config.ts`.

## Usuarios de prueba

Todos usan la contraseña `123456`.

| Perfil | Correo |
|---|---|
| Cliente | stiven.gonzalez@correo.com |
| Cliente | laura.gomez@correo.com |
| Agente | maria.lopez@correo.com |
| Agente | andres.torres@correo.com |
| Administrador | carlos.ramirez@correo.com |

También se pueden crear cuentas nuevas de cliente o agente desde la página de registro.

## Funcionalidades por perfil

**Autenticación:** inicio de sesión con correo y contraseña, y registro de clientes y agentes.

**Cliente:** consultar los eventos disponibles, reservar entradas, ver sus reservas con el estado actual y cancelarlas.

**Agente:** registrar, editar y eliminar sus eventos, y administrar las reservas de sus eventos (cambiar su estado o eliminarlas).

**Administrador:** dashboard con reportes en cuatro pestañas (resumen, comerciales, cobertura y eventos, reservas y operación), con gráfico de ingresos por mes y tablas.

## API REST

Todos los módulos con CRUD implementan las cinco operaciones: `GET` (todos), `GET /:id`, `POST`, `PUT /:id` y `DELETE /:id`.

| Módulo | Rutas base |
|---|---|
| Autenticación | `POST /api/auth/login`, `POST /api/auth/register` |
| Localización | `/api/countries`, `/api/departments`, `/api/cities` |
| Personas | `/api/persons`, `/api/clients`, `/api/agents`, `/api/admins` |
| Eventos | `/api/events` (filtros: `estado`, `agent_id`, `city_id`) |
| Reservas | `/api/reservations` (filtros: `client_id`, `event_id`, `estado`) |
| Reportes | `GET /api/reports/...` (10 consultas) |

Reportes disponibles: `summary`, `income-per-agent`, `income-per-client`, `income-by-month`, `reservations-by-event-month`, `events-by-agent-city`, `events-by-location`, `reservations-by-client`, `cancelled-reservations` y `cancelled-events`.

### Respuestas y errores

| Código | Cuándo ocurre |
|---|---|
| 200 / 201 | Consulta, actualización o eliminación correcta / registro creado |
| 400 | Datos inválidos o faltantes |
| 401 | Correo o contraseña incorrectos |
| 404 | El registro no existe |
| 409 | Correo o identificación repetidos, capacidad superada o registro con dependencias |
| 500 | Error interno del servidor |

## Reglas de negocio implementadas

- El total de una reserva lo calcula el servidor (precio del evento por número de entradas).
- No se puede reservar un evento cancelado o finalizado, ni superar su capacidad.
- Una reserva cancelada debe indicar la causa, y un evento cancelado también.
- Al cancelar un evento se cancelan automáticamente todas sus reservas.
- Las contraseñas se almacenan cifradas con `crypt` de pgcrypto y nunca se devuelven en las respuestas.
- Crear un cliente, agente o administrador se hace en una transacción: se guardan la persona, sus teléfonos y su perfil, o no se guarda nada.

## Limitaciones conocidas

- La autenticación es básica, como pide el enunciado: no se usan tokens, por lo que la restricción por perfil se aplica en el frontend (guards de ruta) y no en la API.
- Los ingresos de los reportes se calculan con las reservas en estado *Confirmada*.

## Integrante

- Stiven Gonzalez