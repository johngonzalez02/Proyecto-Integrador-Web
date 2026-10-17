import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../interfaces/reservation.interface';
import { RESERVATIONS_MOCK } from '../mocks/reservations.mock';

@Injectable({ providedIn: 'root' })
export class ClientReservationsService {
  // Mientras no haya autenticación, el cliente actual es el usuario 1
  getReservations(clienteId = 1): Observable<Reservation[]> {
    return of(RESERVATIONS_MOCK.filter((r) => r.cliente.codigo === clienteId));
  }
}
