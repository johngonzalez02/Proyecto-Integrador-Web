import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventItem } from '../../interfaces/event.interface';
import { ClientEventsService } from '../../services/client-events.service';
import { ClientReservationsService } from '../../services/client-reservations.service';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';

@Component({
  selector: 'app-client-create-reservation-page',
  imports: [CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './client-create-reservation.page.html',
  styleUrl: './client-create-reservation.page.scss',
})
export class ClientCreateReservationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private events = inject(ClientEventsService);
  private reservations = inject(ClientReservationsService);
  private user = inject(UserService);

  event = signal<EventItem | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  entradas = 1;
  observaciones = '';

  get total(): number {
    return (this.event()?.precio ?? 0) * (Number(this.entradas) || 0);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.events.getEventById(id).subscribe({
      next: (e) => {
        this.event.set(e);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    const event = this.event();
    const user = this.user.currentUser();
    if (!event || !user) return;

    if (!Number.isInteger(Number(this.entradas)) || Number(this.entradas) < 1) {
      this.error.set('El número de entradas debe ser al menos 1');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.reservations.create({
      client_id: user.id,
      event_id: event.id,
      entradas: Number(this.entradas),
      observaciones: this.observaciones,
    }).subscribe({
      next: () => this.router.navigate(['/client/reservations']),
      error: (err) => {
        this.error.set(apiError(err));
        this.saving.set(false);
      },
    });
  }
}