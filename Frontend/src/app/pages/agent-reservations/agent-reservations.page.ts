import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RESERVATION_STATES, ReservationItem, ReservationState } from '../../interfaces/reservation.interface';
import { AgentEventsService } from '../../services/agent-events.service';
import { AgentReservationsService } from '../../services/agent-reservations.service';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';
import { reservationBadge } from '../../utils/badges';

interface ReservationRow extends ReservationItem {
  nuevoEstado: ReservationState;
}

@Component({
  selector: 'app-agent-reservations-page',
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './agent-reservations.page.html',
  styleUrl: './agent-reservations.page.scss',
})
export class AgentReservationsPage implements OnInit {
  private events = inject(AgentEventsService);
  private reservations = inject(AgentReservationsService);
  private user = inject(UserService);

  rows: ReservationRow[] = [];
  states = RESERVATION_STATES;
  loading = signal(true);
  error = signal<string | null>(null);
  badge = reservationBadge;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.user.currentUser();
    if (!user) return;

    forkJoin({
      events: this.events.getEvents(user.id),
      reservations: this.reservations.getReservations(),
    }).subscribe({
      next: ({ events, reservations }) => {
        // Solo las reservas de los eventos de este agente
        const ids = new Set(events.map((e) => e.id));
        this.rows = reservations
          .filter((r) => ids.has(r.event_id))
          .map((r) => ({ ...r, nuevoEstado: r.estado }));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }

  update(r: ReservationRow): void {
    if (r.nuevoEstado === r.estado) return;

    let causa: string | undefined;
    if (r.nuevoEstado === 'Cancelada') {
      const answer = prompt('Causa de la cancelación:');
      if (!answer || !answer.trim()) return;
      causa = answer.trim();
    }

    this.error.set(null);
    this.reservations.updateState(r.id, r.nuevoEstado, causa).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(apiError(err)),
    });
  }

  remove(r: ReservationRow): void {
    if (!confirm(`¿Eliminar la reserva #${r.id}?`)) return;

    this.reservations.delete(r.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(apiError(err)),
    });
  }
}