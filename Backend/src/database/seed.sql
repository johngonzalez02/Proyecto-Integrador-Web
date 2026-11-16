-- Países
INSERT INTO countries (nombre) VALUES ('Colombia'), ('Ecuador');

-- Departamentos
INSERT INTO departments (nombre, country_id) VALUES
    ('Valle del Cauca', 1),
    ('Antioquia', 1),
    ('Pichincha', 2);

-- Ciudades
INSERT INTO cities (nombre, department_id) VALUES
    ('Tuluá', 1),
    ('Cali', 1),
    ('Medellín', 2),
    ('Quito', 3);

-- Personas (contraseña de todas: 123456)
INSERT INTO persons (identificacion, nombre, correo, password, direccion, city_id) VALUES
    ('1000000001', 'Carlos Ramírez', 'carlos.ramirez@correo.com', crypt('123456', gen_salt('bf')), 'Calle 10 # 5-20', 2),
    ('1000000002', 'María López', 'maria.lopez@correo.com', crypt('123456', gen_salt('bf')), 'Carrera 8 # 12-30', 2),
    ('1000000003', 'Andrés Torres', 'andres.torres@correo.com', crypt('123456', gen_salt('bf')), 'Calle 25 # 3-14', 1),
    ('1000000004', 'Stiven Gonzalez', 'stiven.gonzalez@correo.com', crypt('123456', gen_salt('bf')), 'Carrera 15 # 7-45', 1),
    ('1000000005', 'Laura Gómez', 'laura.gomez@correo.com', crypt('123456', gen_salt('bf')), 'Avenida 6N # 20-10', 2),
    ('1000000006', 'Juan Pérez', 'juan.perez@correo.com', crypt('123456', gen_salt('bf')), 'Calle 50 # 30-12', 3);

-- Teléfonos
INSERT INTO person_phones (person_id, telefono) VALUES
    (1, '3001110001'),
    (2, '3001110002'),
    (2, '3001110012'),
    (3, '3001110003'),
    (4, '3001110004'),
    (5, '3001110005'),
    (6, '3001110006');

-- Perfiles
INSERT INTO admins (person_id, salario, horario) VALUES
    (1, 3500000, 'Lunes a viernes 8:00 - 17:00');

INSERT INTO agents (person_id, comision, experiencia) VALUES
    (2, 10, 5),
    (3, 8, 3);

INSERT INTO clients (person_id, puntos, publicidad) VALUES
    (4, 120, TRUE),
    (5, 40, FALSE),
    (6, 0, TRUE);

-- Eventos
INSERT INTO events (nombre, descripcion, teatro, city_id, agent_id, fecha_inicio, fecha_fin, capacidad, precio, observaciones, estado, causa_cancelacion) VALUES
    ('Festival de Música del Valle', 'Artistas nacionales y locales de distintos géneros.', 'Coliseo de Ferias', 1, 2, '2026-11-28 18:00', '2026-11-28 23:30', 5000, 85000, 'Apertura de puertas a las 5:00 PM.', 'Programado', NULL),
    ('Concierto Sinfónico de Primavera', 'Orquesta Sinfónica del Valle con repertorio clásico y contemporáneo.', 'Teatro Municipal', 2, 2, '2026-12-10 19:00', '2026-12-10 21:30', 1200, 65000, 'Boletería en puntos autorizados.', 'En Boleteria', NULL),
    ('Rock al Parque Valle', 'Festival de rock con bandas nacionales e internacionales.', 'Estadio Doce de Octubre', 1, 3, '2026-11-16 17:00', '2026-11-16 23:00', 8000, 45000, 'Evento en desarrollo.', 'En Vivo', NULL),
    ('Obra de Teatro: El Principito', 'Adaptación teatral del clásico literario.', 'Teatro Municipal Enrique Buenaventura', 2, 3, '2026-09-28 19:00', '2026-09-28 21:00', 900, 55000, 'Evento finalizado satisfactoriamente.', 'Finalizado', NULL),
    ('Concierto de Música Urbana', 'Los principales exponentes de música urbana de la región.', 'Centro de Eventos Valle del Pacífico', 2, 2, '2026-10-10 19:00', '2026-10-10 23:00', 6000, 75000, 'Se realizará devolución del dinero.', 'Cancelado', 'Motivos logísticos del organizador.'),
    ('Noche de Jazz', 'Velada íntima con las mejores agrupaciones de jazz.', 'Teatro Jorge Isaacs', 2, 3, '2026-12-05 20:00', '2026-12-05 23:00', 700, 70000, 'Cupos limitados.', 'En Boleteria', NULL),
    ('Festival de Cine Andino', 'Muestra de cine de la región andina.', 'Teatro Pablo Tobón Uribe', 3, 2, '2026-08-14 18:00', '2026-08-14 22:00', 1000, 50000, 'Evento finalizado.', 'Finalizado', NULL),
    ('Noche Andina en Quito', 'Concierto de música andina contemporánea.', 'Teatro Sucre', 4, 3, '2026-12-20 20:00', '2026-12-20 23:00', 800, 120000, 'Entrada con puerta de acceso numerada.', 'Programado', NULL);

-- Reservas
INSERT INTO reservations (client_id, event_id, fecha, total, entradas, observaciones, estado, causa_cancelacion) VALUES
    (4, 4, '2026-09-10 10:00', 110000, 2, 'Sin observaciones.', 'Confirmada', NULL),
    (4, 7, '2026-07-20 09:30', 150000, 3, 'Sin observaciones.', 'Confirmada', NULL),
    (4, 1, '2026-10-05 16:40', 340000, 4, 'Sentados juntos, por favor.', 'Reservada', NULL),
    (5, 2, '2026-10-02 10:15', 130000, 2, 'Sin observaciones.', 'Confirmada', NULL),
    (5, 5, '2026-09-25 14:05', 75000, 1, 'Sin observaciones.', 'Cancelada', 'Evento cancelado por el organizador.'),
    (5, 6, '2026-10-18 11:30', 210000, 3, 'Zona preferencial.', 'Reservada', NULL),
    (6, 3, '2026-11-01 15:00', 90000, 2, 'Sin observaciones.', 'Confirmada', NULL),
    (6, 1, '2026-11-03 12:20', 170000, 2, 'Sin observaciones.', 'Cancelada', 'El cliente desistió de la compra.'),
    (6, 2, '2026-11-08 18:45', 325000, 5, 'Grupo familiar.', 'Reservada', NULL),
    (5, 8, '2026-11-10 09:00', 240000, 2, 'Sin observaciones.', 'Confirmada', NULL);