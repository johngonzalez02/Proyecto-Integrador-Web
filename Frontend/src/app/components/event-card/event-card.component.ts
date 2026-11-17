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

  get statusClass(): string {
    return this.event ? this.statusClasses[this.event.estado] : '';
  }
}