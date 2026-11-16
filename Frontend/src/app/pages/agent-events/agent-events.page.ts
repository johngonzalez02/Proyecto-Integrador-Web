import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AgentEventsService } from '../../services/agent-events.service';

@Component({
  selector: 'app-agent-events-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './agent-events.page.html',
  styleUrl: './agent-events.page.scss',
})
export class AgentEventsPage {
  private service = inject(AgentEventsService);
  events = toSignal(this.service.getEvents(), { initialValue: [] });
}
