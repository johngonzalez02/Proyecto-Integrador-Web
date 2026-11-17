import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationItem } from '../../interfaces/reservation.interface';
import { ClientReservationsService } from '../../services/client-reservations.service';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';
import { reservationBadge } from '../../utils/badges';

@Component({
  selector: 'app-client-reservations-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './client-reservations.page.html',
  styleUrl: './client-reservations.page.scss',
})
export class ClientReservationsPage implements OnInit {
  private service = inject(ClientReservationsService);
  private user = inject(UserService);

  reservations = signal<ReservationItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  badge = reservationBadge;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.user.currentUser();
    if (!user) return;

    this.service.getReservations(user.id).subscribe({
      next: (data) => {
        this.reservations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }

  cancel(r: ReservationItem): void {
    if (!confirm(`¿Cancelar la reserva #${r.id} de "${r.evento}"?`)) return;

    this.service.cancel(r.id, 'Cancelada por el cliente').subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(apiError(err)),
    });
  }
}