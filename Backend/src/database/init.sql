CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ubicación geográfica
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE
);

-- Personas
CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    city_id INTEGER NOT NULL REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS person_phones (
    id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    telefono VARCHAR(20) NOT NULL
);

-- Perfiles (comparten clave con persons)
CREATE TABLE IF NOT EXISTS clients (
    person_id INTEGER PRIMARY KEY REFERENCES persons(id) ON DELETE CASCADE,
    puntos INTEGER NOT NULL DEFAULT 0 CHECK (puntos >= 0),
    publicidad BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS agents (
    person_id INTEGER PRIMARY KEY REFERENCES persons(id) ON DELETE CASCADE,
    comision INTEGER NOT NULL CHECK (comision BETWEEN 0 AND 100),
    experiencia INTEGER NOT NULL CHECK (experiencia >= 0)
);

CREATE TABLE IF NOT EXISTS admins (
    person_id INTEGER PRIMARY KEY REFERENCES persons(id) ON DELETE CASCADE,
    salario INTEGER NOT NULL CHECK (salario >= 0),
    horario VARCHAR(100) NOT NULL
);

-- Eventos
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    teatro VARCHAR(120) NOT NULL,
    city_id INTEGER NOT NULL REFERENCES cities(id),
    agent_id INTEGER NOT NULL REFERENCES agents(person_id) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    capacidad INTEGER NOT NULL CHECK (capacidad > 0),
    precio INTEGER NOT NULL CHECK (precio >= 0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Programado'
        CHECK (estado IN ('Programado', 'En Boleteria', 'En Vivo', 'Finalizado', 'Cancelado')),
    causa_cancelacion TEXT,
    CHECK (fecha_fin > fecha_inicio)
);

-- Reservas
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(person_id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    fecha TIMESTAMP NOT NULL DEFAULT NOW(),
    total INTEGER NOT NULL CHECK (total >= 0),
    entradas INTEGER NOT NULL CHECK (entradas > 0),
    observaciones TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'Reservada'
        CHECK (estado IN ('Reservada', 'Confirmada', 'Cancelada')),
    causa_cancelacion TEXT
);