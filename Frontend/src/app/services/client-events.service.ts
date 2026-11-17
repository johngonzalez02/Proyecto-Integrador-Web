import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { EventItem } from '../interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class ClientEventsService {
  private http = inject(HttpClient);

  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(`${API_URL}/events`);
  }

  getEventById(id: number): Observable<EventItem> {
    return this.http.get<EventItem>(`${API_URL}/events/${id}`);
  }
}