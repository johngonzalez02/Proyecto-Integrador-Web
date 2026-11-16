import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientEventsService } from '../../services/client-events.service';

@Component({
  selector: 'app-client-create-reservation-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './client-create-reservation.page.html',
  styleUrl: './client-create-reservation.page.scss',
})
export class ClientCreateReservationPage {
  private route = inject(ActivatedRoute);
  private service = inject(ClientEventsService);

  event = toSignal(this.service.getEventById(Number(this.route.snapshot.paramMap.get('id'))));
  entradas = signal(1);
  total = computed(() => (this.event()?.precio ?? 0) * this.entradas());

  setEntradas(value: string) {
    this.entradas.set(Math.max(1, Number(value) || 1));
  }
}
