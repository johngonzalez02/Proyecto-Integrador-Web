import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { ReservationItem, ReservationState } from '../interfaces/reservation.interface';

@Injectable({ providedIn: 'root' })
export class AgentReservationsService {
  private http = inject(HttpClient);

  getReservations(): Observable<ReservationItem[]> {
    return this.http.get<ReservationItem[]>(`${API_URL}/reservations`);
  }

  updateState(id: number, estado: ReservationState, causa?: string): Observable<ReservationItem> {
    return this.http.put<ReservationItem>(`${API_URL}/reservations/${id}`, { estado, causa_cancelacion: causa });
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/reservations/${id}`);
  }
}