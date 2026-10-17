import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../interfaces/event.interface';
import { EVENTS_MOCK } from '../mocks/events.mock';

@Injectable({ providedIn: 'root' })
export class ClientEventsService {
  getEvents(): Observable<Event[]> {
    return of(EVENTS_MOCK);
  }

  getEventById(codigo: number): Observable<Event | undefined> {
    return of(EVENTS_MOCK.find((e) => e.codigo === codigo));
  }
}
