import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ReservationState } from '../../interfaces/reservation.interface';
import { AgentEventsService } from '../../services/agent-events.service';
import { AgentReservationsService } from '../../services/agent-reservations.service';

@Component({
  selector: 'app-admin-page',
  imports: [NavbarComponent, CurrencyPipe],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.scss',
})
export class AdminPage {
  events = toSignal(inject(AgentEventsService).getEvents(), { initialValue: [] });
  reservations = toSignal(inject(AgentReservationsService).getReservations(), { initialValue: [] });
  states: ReservationState[] = ['Reservada', 'Confirmada', 'Cancelada'];
  colors: Record<ReservationState, string> = { Reservada: 'bg-warning', Confirmada: 'bg-success', Cancelada: 'bg-danger' };

  get ingresos(): number {
    return this.reservations().filter((r) => r.estado === 'Confirmada').reduce((sum, r) => sum + r.total, 0);
  }

  count(estado: ReservationState): number {
    return this.reservations().filter((r) => r.estado === estado).length;
  }

  percent(estado: ReservationState): number {
    const total = this.reservations().length;
    return total ? Math.round((this.count(estado) * 100) / total) : 0;
  }
}
