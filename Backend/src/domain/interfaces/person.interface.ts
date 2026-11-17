export type PersonRole = "client" | "agent" | "admin";

export interface Person {
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
  rol: PersonRole | null;
}

export interface ClientProfile extends Person {
  puntos: number;
  publicidad: boolean;
}

export interface AgentProfile extends Person {
  comision: number;
  experiencia: number;
}

export interface AdminProfile extends Person {
  salario: number;
  horario: string;
}