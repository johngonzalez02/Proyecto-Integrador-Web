import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReservationState } from '../../interfaces/reservation.interface';
import { AgentReservationsService } from '../../services/agent-reservations.service';

@Component({
  selector: 'app-agent-reservations-page',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './agent-reservations.page.html',
  styleUrl: './agent-reservations.page.scss',
})
export class AgentReservationsPage {
  private service = inject(AgentReservationsService);
  reservations = toSignal(this.service.getReservations(), { initialValue: [] });
  states: ReservationState[] = ['Reservada', 'Confirmada', 'Cancelada'];
}
