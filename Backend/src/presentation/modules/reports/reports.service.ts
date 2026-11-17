import { pool } from "../../../config/database";
import { Validators } from "../../../domain/utils/validators";

/**
 * Reportes del sistema. Los ingresos se calculan con las reservas en estado Confirmada.
 */
export class ReportsService {

  private year(query: Record<string, unknown>): number {
    return query.year ? Validators.int(query.year, "year", 2000) : 2026;
  }

  /** Número de clientes, agentes, administradores, reservas y eventos. */
  public async summary() {
    const result = await pool.query(`
      SELECT (SELECT COUNT(*) FROM clients)::int AS clientes,
             (SELECT COUNT(*) FROM agents)::int AS agentes,
             (SELECT COUNT(*) FROM admins)::int AS administradores,
             (SELECT COUNT(*) FROM reservations)::int AS reservas,
             (SELECT COUNT(*) FROM events)::int AS eventos;`);
    return result.rows[0];
  }

  /** Ingresos por agente y promedio general por agente. */
  public async incomePerAgent() {
    const result = await pool.query(`
      SELECT a.person_id AS agent_id, p.nombre AS agente,
             COUNT(DISTINCT e.id)::int AS eventos,
             COUNT(r.id)::int AS reservas,
             COALESCE(SUM(r.total), 0)::int AS ingresos,
             COALESCE(ROUND(AVG(r.total)), 0)::int AS promedio_por_reserva
      FROM agents a
      INNER JOIN persons p ON p.id = a.person_id
      LEFT JOIN events e ON e.agent_id = a.person_id
      LEFT JOIN reservations r ON r.event_id = e.id AND r.estado = 'Confirmada'
      GROUP BY a.person_id, p.nombre
      ORDER BY ingresos DESC;`);
    const detalle = result.rows;
    const total = detalle.reduce((sum, r) => sum + r.ingresos, 0);
    return { promedio: detalle.length ? Math.round(total / detalle.length) : 0, detalle };
  }

  /** Ingresos por cliente y promedio general por cliente. */
  public async incomePerClient() {
    const result = await pool.query(`
      SELECT c.person_id AS client_id, p.nombre AS cliente,
             COUNT(r.id)::int AS reservas,
             COALESCE(SUM(r.total), 0)::int AS ingresos,
             COALESCE(ROUND(AVG(r.total)), 0)::int AS promedio_por_reserva
      FROM clients c
      INNER JOIN persons p ON p.id = c.person_id
      LEFT JOIN reservations r ON r.client_id = c.person_id AND r.estado = 'Confirmada'
      GROUP BY c.person_id, p.nombre
      ORDER BY ingresos DESC;`);
    const detalle = result.rows;
    const total = detalle.reduce((sum, r) => sum + r.ingresos, 0);
    return { promedio: detalle.length ? Math.round(total / detalle.length) : 0, detalle };
  }

  /** Ingresos totales por mes (12 meses, con ceros donde no hay ventas). */
  public async incomeByMonth(query: Record<string, unknown>) {
    const result = await pool.query(`
      SELECT m AS mes, COALESCE(SUM(r.total), 0)::int AS ingresos
      FROM generate_series(1, 12) AS m
      LEFT JOIN reservations r
        ON EXTRACT(MONTH FROM r.fecha) = m
       AND EXTRACT(YEAR FROM r.fecha) = $1
       AND r.estado = 'Confirmada'
      GROUP BY m
      ORDER BY m;`, [this.year(query)]);
    return result.rows;
  }

  /** Número de reservas por evento y por mes. */
  public async reservationsByEventMonth(query: Record<string, unknown>) {
    const result = await pool.query(`
      SELECT e.id AS event_id, e.nombre AS evento,
             EXTRACT(MONTH FROM r.fecha)::int AS mes,
             COUNT(*)::int AS reservas
      FROM reservations r
      INNER JOIN events e ON e.id = r.event_id
      WHERE EXTRACT(YEAR FROM r.fecha) = $1
      GROUP BY e.id, e.nombre, EXTRACT(MONTH FROM r.fecha)
      ORDER BY e.nombre, mes;`, [this.year(query)]);
    return result.rows;
  }

  /** Número de eventos creados por cada agente y por ciudad. */
  public async eventsByAgentCity() {
    const result = await pool.query(`
      SELECT e.agent_id, pa.nombre AS agente, ci.nombre AS ciudad, COUNT(*)::int AS eventos
      FROM events e
      INNER JOIN persons pa ON pa.id = e.agent_id
      INNER JOIN cities ci ON ci.id = e.city_id
      GROUP BY e.agent_id, pa.nombre, ci.nombre
      ORDER BY pa.nombre, ci.nombre;`);
    return result.rows;
  }

  /** Listado de eventos por país, departamento y ciudad. */
  public async eventsByLocation() {
    const result = await pool.query(`
      SELECT co.nombre AS country, d.nombre AS department, ci.nombre AS city,
             e.id, e.nombre, e.teatro, e.fecha_inicio, e.estado
      FROM events e
      INNER JOIN cities ci ON ci.id = e.city_id
      INNER JOIN departments d ON d.id = ci.department_id
      INNER JOIN countries co ON co.id = d.country_id
      ORDER BY co.nombre, d.nombre, ci.nombre, e.fecha_inicio;`);
    return result.rows;
  }

  /** Historial de reservas por cliente (opcionalmente de un solo cliente). */
  public async reservationsByClient(query: Record<string, unknown>) {
    const params: unknown[] = [];
    let where = "";
    if (query.client_id) {
      params.push(Validators.id(query.client_id, "client_id"));
      where = "WHERE r.client_id = $1";
    }
    const result = await pool.query(`
      SELECT r.client_id, pc.nombre AS cliente, r.id, e.nombre AS evento,
             r.fecha, r.entradas, r.total, r.estado
      FROM reservations r
      INNER JOIN persons pc ON pc.id = r.client_id
      INNER JOIN events e ON e.id = r.event_id
      ${where}
      ORDER BY pc.nombre, r.fecha DESC;`, params);
    return result.rows;
  }

  /** Reservas canceladas y su causa. */
  public async cancelledReservations() {
    const result = await pool.query(`
      SELECT r.id, pc.nombre AS cliente, e.nombre AS evento, r.fecha, r.total,
             r.causa_cancelacion AS causa
      FROM reservations r
      INNER JOIN persons pc ON pc.id = r.client_id
      INNER JOIN events e ON e.id = r.event_id
      WHERE r.estado = 'Cancelada'
      ORDER BY r.fecha DESC;`);
    return result.rows;
  }

  /** Eventos cancelados y su causa. */
  public async cancelledEvents() {
    const result = await pool.query(`
      SELECT e.id, e.nombre, e.teatro, ci.nombre AS ciudad, e.fecha_inicio,
             e.causa_cancelacion AS causa
      FROM events e
      INNER JOIN cities ci ON ci.id = e.city_id
      WHERE e.estado = 'Cancelado'
      ORDER BY e.fecha_inicio DESC;`);
    return result.rows;
  }

}