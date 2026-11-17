import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem, EventState } from '../../interfaces/event.interface';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  @Input() event: EventItem | null = null;
  @Input() actionLabel = 'Ver evento';
  @Input() actionLink: string | null = null;

  private statusClasses: Record<EventState, string> = {
    'Programado': 'status--scheduled',
    'En Boleteria': 'status--ticket',
    'En Vivo': 'status--live',
    'Finalizado': 'status--finished',
    'Cancelado': 'status--cancelled',
  };

  private gradients = [
    'linear-gradient(135deg, #0d6efd, #6610f2)',
    'linear-gradient(135deg, #198754, #20c997)',
    'linear-gradient(135deg, #fd7e14, #dc3545)',
    'linear-gradient(135deg, #6f42c1, #d63384)',
    'linear-gradient(135deg, #0aa2c0, #0d6efd)',
    'linear-gradient(135deg, #343a40, #6c757d)',
  ];

  get statusClass(): string {
    return this.event ? this.statusClasses[this.event.estado] : '';
  }

  /** Cada evento conserva siempre el mismo color, según su id. */
  get banner(): string {
    return this.event ? this.gradients[this.event.id % this.gradients.length] : '';
  }
}