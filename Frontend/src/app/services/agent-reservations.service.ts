import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../interfaces/reservation.interface';
import { RESERVATIONS_MOCK } from '../mocks/reservations.mock';

@Injectable({ providedIn: 'root' })
export class AgentReservationsService {
  getReservations(): Observable<Reservation[]> {
    return of(RESERVATIONS_MOCK);
  }
}
