import { Event } from './event.interface';
import { User } from './user.interface';

export interface Reservation {
  codigo: number;
  fecha: Date;
  total: number;
  entradas: number;
  observaciones: string;
  estado: ReservationState;
  evento: Event;
  cliente: User;
}

export type ReservationState = 'Reservada' | 'Confirmada' | 'Cancelada';
