export type ReservationState = 'Reservada' | 'Confirmada' | 'Cancelada';

export const RESERVATION_STATES: ReservationState[] = ['Reservada', 'Confirmada', 'Cancelada'];

export interface ReservationItem {
  id: number;
  fecha: string;
  total: number;
  entradas: number;
  observaciones: string | null;
  estado: ReservationState;
  causa_cancelacion: string | null;
  client_id: number;
  cliente: string;
  correo: string;
  event_id: number;
  evento: string;
  teatro: string;
  ciudad: string;
  fecha_inicio: string;
  precio: number;
}