import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { API_URL } from '../config/api.config';
import {
  AdminReports, AgentCity, AgentIncome, CancelledEvent, CancelledReservation, ClientHistory,
  ClientIncome, EventLocation, EventMonth, IncomeReport, MonthIncome, Summary,
} from '../interfaces/report.interface';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private http = inject(HttpClient);

  private get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_URL}/reports/${path}`);
  }

  /** Carga todos los reportes del dashboard en paralelo. */
  getDashboard(): Observable<AdminReports> {
    return forkJoin({
      summary: this.get<Summary>('summary'),
      incomePerAgent: this.get<IncomeReport<AgentIncome>>('income-per-agent'),
      incomePerClient: this.get<IncomeReport<ClientIncome>>('income-per-client'),
      incomeByMonth: this.get<MonthIncome[]>('income-by-month'),
      reservationsByEventMonth: this.get<EventMonth[]>('reservations-by-event-month'),
      eventsByAgentCity: this.get<AgentCity[]>('events-by-agent-city'),
      eventsByLocation: this.get<EventLocation[]>('events-by-location'),
      reservationsByClient: this.get<ClientHistory[]>('reservations-by-client'),
      cancelledReservations: this.get<CancelledReservation[]>('cancelled-reservations'),
      cancelledEvents: this.get<CancelledEvent[]>('cancelled-events'),
    });
  }
}