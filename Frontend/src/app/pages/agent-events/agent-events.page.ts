import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem } from '../../interfaces/event.interface';
import { AgentEventsService } from '../../services/agent-events.service';
import { UserService } from '../../services/user.service';
import { apiError } from '../../utils/api-error';
import { eventBadge } from '../../utils/badges';

@Component({
  selector: 'app-agent-events-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './agent-events.page.html',
  styleUrl: './agent-events.page.scss',
})
export class AgentEventsPage implements OnInit {
  private service = inject(AgentEventsService);
  private user = inject(UserService);

  events = signal<EventItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  badge = eventBadge;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const user = this.user.currentUser();
    if (!user) return;

    this.service.getEvents(user.id).subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(apiError(err));
        this.loading.set(false);
      },
    });
  }

  remove(e: EventItem): void {
    if (!confirm(`¿Eliminar el evento "${e.nombre}"? También se eliminarán sus reservas.`)) return;

    this.service.delete(e.id).subscribe({
      next: () => this.load(),
      error: (err) => this.error.set(apiError(err)),
    });
  }
}