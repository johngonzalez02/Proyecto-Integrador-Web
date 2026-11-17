export type EventState = "Programado" | "En Boleteria" | "En Vivo" | "Finalizado" | "Cancelado";

export const EVENT_STATES: readonly EventState[] = [
  "Programado",
  "En Boleteria",
  "En Vivo",
  "Finalizado",
  "Cancelado",
];

export interface EventItem {
  id: number;
  nombre: string;
  descripcion: string;
  teatro: string;
  city_id: number;
  city: string;
  department: string;
  country: string;
  agent_id: number;
  agente: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  capacidad: number;
  reservadas: number;
  disponibles: number;
  precio: number;
  observaciones: string | null;
  estado: EventState;
  causa_cancelacion: string | null;
}