import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AdminReports } from '../../interfaces/report.interface';
import { ReportsService } from '../../services/reports.service';
import { apiError } from '../../utils/api-error';
import { eventBadge, reservationBadge } from '../../utils/badges';

type Tab = 'resumen' | 'comerciales' | 'cobertura' | 'operacion';

@Component({
  selector: 'app-admin-page',
  imports: [NavbarComponent, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.scss',
})
export class AdminPage implements OnInit {
  private reports = inject(ReportsService);

  data = signal<AdminReports | null>(null);
  error = signal<string | null>(null);
  tab = signal<Tab>('resumen');
  year = 2026;
  eventBadge = eventBadge;
  reservationBadge = reservationBadge;

  tabs: { key: Tab; label: string }[] = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'comerciales', label: 'Comerciales' },
    { key: 'cobertura', label: 'Cobertura y eventos' },
    { key: 'operacion', label: 'Reservas y operación' },
  ];

  private months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  cards = computed(() => {
    const s = this.data()?.summary;
    if (!s) return [];
    return [
      { label: 'Clientes', value: s.clientes, icon: 'people' },
      { label: 'Agentes', value: s.agentes, icon: 'person-badge' },
      { label: 'Administradores', value: s.administradores, icon: 'shield-check' },
      { label: 'Reservas', value: s.reservas, icon: 'ticket-perforated' },
      { label: 'Eventos', value: s.eventos, icon: 'calendar-event' },
    ];
  });

  maxIncome = computed(() => {
    const values = this.data()?.incomeByMonth.map((m) => m.ingresos) ?? [];
    return Math.max(1, ...values);
  });

  ngOnInit(): void {
    this.reports.getDashboard().subscribe({
      next: (d) => this.data.set(d),
      error: (err) => this.error.set(apiError(err)),
    });
  }

  monthName(m: number): string {
    return this.months[m - 1] ?? String(m);
  }

  monthShort(m: number): string {
    return this.monthName(m).slice(0, 3);
  }
}