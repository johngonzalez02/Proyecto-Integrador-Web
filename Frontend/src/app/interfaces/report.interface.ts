export interface Summary { clientes: number; agentes: number; administradores: number; reservas: number; eventos: number; }
export interface AgentIncome { agent_id: number; agente: string; eventos: number; reservas: number; ingresos: number; promedio_por_reserva: number; }
export interface ClientIncome { client_id: number; cliente: string; reservas: number; ingresos: number; promedio_por_reserva: number; }
export interface IncomeReport<T> { promedio: number; detalle: T[]; }
export interface MonthIncome { mes: number; ingresos: number; }
export interface EventMonth { event_id: number; evento: string; mes: number; reservas: number; }
export interface AgentCity { agent_id: number; agente: string; ciudad: string; eventos: number; }
export interface EventLocation { country: string; department: string; city: string; id: number; nombre: string; teatro: string; fecha_inicio: string; estado: string; }
export interface ClientHistory { client_id: number; cliente: string; id: number; evento: string; fecha: string; entradas: number; total: number; estado: string; }
export interface CancelledReservation { id: number; cliente: string; evento: string; fecha: string; total: number; causa: string | null; }
export interface CancelledEvent { id: number; nombre: string; teatro: string; ciudad: string; fecha_inicio: string; causa: string | null; }

export interface AdminReports {
  summary: Summary;
  incomePerAgent: IncomeReport<AgentIncome>;
  incomePerClient: IncomeReport<ClientIncome>;
  incomeByMonth: MonthIncome[];
  reservationsByEventMonth: EventMonth[];
  eventsByAgentCity: AgentCity[];
  eventsByLocation: EventLocation[];
  reservationsByClient: ClientHistory[];
  cancelledReservations: CancelledReservation[];
  cancelledEvents: CancelledEvent[];
}