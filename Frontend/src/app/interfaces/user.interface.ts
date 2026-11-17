export type UserRole = 'client' | 'agent' | 'admin';

export interface User {
  id: number;
  identificacion: string;
  nombre: string;
  correo: string;
  direccion: string;
  city_id: number;
  city: string;
  department: string;
  country: string;
  telefonos: string[];
  rol: UserRole | null;
}