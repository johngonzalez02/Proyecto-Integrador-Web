# Proyecto Integrador Web - EventApp

Frontend de una aplicación web para la gestión de eventos y reservas, desarrollado como avance 1 del Proyecto Integrador de Bases de Datos (UCEVA).

## Tecnologías
- Angular 20
- TypeScript
- HTML5 y SCSS
- Bootstrap y Bootstrap Icons

## Perfiles y vistas
- **Auth:** inicio de sesión y registro
- **Cliente:** ver eventos, reservar y consultar sus reservas
- **Agente:** registrar eventos, ver eventos y administrar reservas
- **Administrador:** reportes con tarjetas, barras y tablas

## Datos mockeados
No hay backend todavía. Los datos viven en `src/app/mocks` y se consumen mediante servicios en `src/app/services`.

## Estructura
src/app
├── components (navbar, event-card)
├── interfaces (event, reservation, user)
├── mocks
├── pages (11 páginas)
└── services
## Ejecución
```bash
npm install
ng serve
```
Abrir `http://localhost:4200`.

## Integrantes
- Stiven Gonzalez
