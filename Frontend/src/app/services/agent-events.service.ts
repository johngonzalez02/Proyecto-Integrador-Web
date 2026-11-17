import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { EventItem, EventPayload } from '../interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class AgentEventsService {
  private http = inject(HttpClient);

  getEvents(agentId: number): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(`${API_URL}/events`, { params: { agent_id: agentId } });
  }

  getEventById(id: number): Observable<EventItem> {
    return this.http.get<EventItem>(`${API_URL}/events/${id}`);
  }

  create(payload: EventPayload): Observable<EventItem> {
    return this.http.post<EventItem>(`${API_URL}/events`, payload);
  }

  update(id: number, payload: EventPayload): Observable<EventItem> {
    return this.http.put<EventItem>(`${API_URL}/events/${id}`, payload);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/events/${id}`);
  }
}