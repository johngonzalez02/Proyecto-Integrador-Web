export type EventState = 'Programado' | 'En Boleteria' | 'En Vivo' | 'Finalizado' | 'Cancelado';

export const EVENT_STATES: EventState[] = ['Programado', 'En Boleteria', 'En Vivo', 'Finalizado', 'Cancelado'];

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
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  reservadas: number;
  disponibles: number;
  precio: number;
  observaciones: string | null;
  estado: EventState;
  causa_cancelacion: string | null;
}

export interface EventPayload {
  nombre: string;
  descripcion: string;
  teatro: string;
  city_id: number;
  agent_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  precio: number;
  observaciones?: string;
  estado: EventState;
  causa_cancelacion?: string;
}