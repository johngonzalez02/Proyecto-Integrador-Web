export interface User {
  codigo: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: UserRole;
}

export type UserRole = 'client' | 'agent' | 'admin';
