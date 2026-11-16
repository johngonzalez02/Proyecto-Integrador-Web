import { User } from '../interfaces/user.interface';

export const USERS_MOCK: User[] = [
  { codigo: 1, nombre: 'Juan', apellido: 'David', correo: 'juan.david@correo.com', telefono: '3001112233', rol: 'client' },
  { codigo: 2, nombre: 'María', apellido: 'López', correo: 'maria.lopez@correo.com', telefono: '3004445566', rol: 'agent' },
  { codigo: 3, nombre: 'Carlos', apellido: 'Ramírez', correo: 'carlos.ramirez@correo.com', telefono: '3007778899', rol: 'admin' },
  { codigo: 4, nombre: 'Laura', apellido: 'Gómez', correo: 'laura.gomez@correo.com', telefono: '3002223344', rol: 'client' },
];
