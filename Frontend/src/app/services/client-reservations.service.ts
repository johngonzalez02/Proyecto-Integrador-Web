import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { ReservationItem } from '../interfaces/reservation.interface';

@Injectable({ providedIn: 'root' })
export class ClientReservationsService {
  private http = inject(HttpClient);

  getReservations(clientId: number): Observable<ReservationItem[]> {
    return this.http.get<ReservationItem[]>(`${API_URL}/reservations`, { params: { client_id: clientId } });
  }

  create(data: { client_id: number; event_id: number; entradas: number; observaciones?: string }): Observable<ReservationItem> {
    return this.http.post<ReservationItem>(`${API_URL}/reservations`, data);
  }

  cancel(id: number, causa: string): Observable<ReservationItem> {
    return this.http.put<ReservationItem>(`${API_URL}/reservations/${id}`, { estado: 'Cancelada', causa_cancelacion: causa });
  }
}