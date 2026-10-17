import { Reservation, ReservationState } from '../interfaces/reservation.interface';
import { EVENTS_MOCK } from './events.mock';
import { USERS_MOCK } from './users.mock';

function build(
  codigo: number,
  fecha: string,
  eventoId: number,
  clienteId: number,
  entradas: number,
  estado: ReservationState,
  observaciones: string,
): Reservation {
  const evento = EVENTS_MOCK.find((e) => e.codigo === eventoId)!;
  const cliente = USERS_MOCK.find((u) => u.codigo === clienteId)!;
  return {
    codigo,
    fecha: new Date(fecha),
    total: evento.precio * entradas,
    entradas,
    observaciones,
    estado,
    evento,
    cliente,
  };
}

export const RESERVATIONS_MOCK: Reservation[] = [
  build(5001, '2026-10-02T10:15:00', 1002, 1, 2, 'Confirmada', 'Sin observaciones.'),
  build(5002, '2026-10-05T16:40:00', 1001, 1, 4, 'Reservada', 'Sentados juntos, por favor.'),
  build(5003, '2026-10-03T09:20:00', 1005, 1, 1, 'Cancelada', 'Evento cancelado por el organizador.'),
  build(5004, '2026-10-08T14:05:00', 1006, 4, 3, 'Reservada', 'Zona preferencial.'),
  build(5005, '2026-10-09T11:30:00', 1001, 4, 2, 'Confirmada', 'Sin observaciones.'),
];
