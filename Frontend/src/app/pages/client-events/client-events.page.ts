import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventCardComponent } from '../../components/event-card/event-card.component';
import { ClientEventsService } from '../../services/client-events.service';

@Component({
  selector: 'app-client-events-page',
  imports: [EventCardComponent],
  templateUrl: './client-events.page.html',
  styleUrl: './client-events.page.scss',
})
export class ClientEventsPage {
  private eventsService = inject(ClientEventsService);

  events = toSignal(this.eventsService.getEvents(), { initialValue: [] });
};