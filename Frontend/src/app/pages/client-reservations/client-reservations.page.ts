import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReservationState } from '../../interfaces/reservation.interface';
import { ClientReservationsService } from '../../services/client-reservations.service';

@Component({
  selector: 'app-client-reservations-page',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './client-reservations.page.html',
  styleUrl: './client-reservations.page.scss',
})
export class ClientReservationsPage {
  private service = inject(ClientReservationsService);
  reservations = toSignal(this.service.getReservations(), { initialValue: [] });

  badge(estado: ReservationState): string {
    return { Reservada: 'bg-warning text-dark', Confirmada: 'bg-success', Cancelada: 'bg-danger' }[estado];
  }
}
