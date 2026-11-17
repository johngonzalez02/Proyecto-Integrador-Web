import { Component, OnInit, inject, signal } from '@angular/core';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventItem } from '../../interfaces/event.interface';
import { ClientEventsService } from '../../services/client-events.service';
import { apiError } from '../../utils/api-error';

@Component({
  selector: 'app-client-events-page',
  imports: [EventCardComponent],
  templateUrl: './client-events.page.html',
  styleUrl: './client-events.page.scss',
})
export class ClientEventsPage implements OnInit {
  private service = inject(ClientEventsService);

  events = signal<EventItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.service.getEvents().subscribe({
      next: (data) => {
        // Solo se muestran los eventos disponibles para reservar
        this.events.set(data.filter((e) => e.estado !== 'Cancelado' && e.estado !== 'Finalizado'));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }
}