import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { EVENT_STATES, EventItem } from "../../../domain/interfaces/event.interface";
import { Validators } from "../../../domain/utils/validators";
import { withTransaction } from "../../../domain/utils/transaction";
import { CrudService } from "../shared/crud.controller";

export class EventsService implements CrudService {

  private readonly baseQuery = `
    SELECT e.id, e.nombre, e.descripcion, e.teatro,
           e.city_id, ci.nombre AS city, d.nombre AS department, co.nombre AS country,
           e.agent_id, pa.nombre AS agente,
           e.fecha_inicio, e.fecha_fin,
           e.capacidad, COALESCE(rs.reservadas, 0) AS reservadas,
           e.capacidad - COALESCE(rs.reservadas, 0) AS disponibles,
           e.precio, e.observaciones, e.estado, e.causa_cancelacion
    FROM events e
    INNER JOIN cities ci ON ci.id = e.city_id
    INNER JOIN departments d ON d.id = ci.department_id
    INNER JOIN countries co ON co.id = d.country_id
    INNER JOIN persons pa ON pa.id = e.agent_id
    LEFT JOIN LATERAL (
      SELECT SUM(r.entradas)::int AS reservadas
      FROM reservations r
      WHERE r.event_id = e.id AND r.estado <> 'Cancelada'
    ) rs ON TRUE`;

  public async getAll(query: Record<string, unknown> = {}): Promise<EventItem[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (query.estado) {
      params.push(Validators.oneOf(query.estado, "estado", EVENT_STATES));
      conditions.push(`e.estado = $${params.length}`);
    }
    if (query.agent_id) {
      params.push(Validators.id(query.agent_id, "agent_id"));
      conditions.push(`e.agent_id = $${params.length}`);
    }
    if (query.city_id) {
      params.push(Validators.id(query.city_id, "city_id"));
      conditions.push(`e.city_id = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(`${this.baseQuery} ${where} ORDER BY e.fecha_inicio;`, params);
    return result.rows;
  }

  public async getById(id: number): Promise<EventItem> {
    const result = await pool.query(`${this.baseQuery} WHERE e.id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound("Evento no encontrado");
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<EventItem> {
    const e = this.parse(body);
    const result = await pool.query(
      `INSERT INTO events (nombre, descripcion, teatro, city_id, agent_id, fecha_inicio, fecha_fin,
                           capacidad, precio, observaciones, estado, causa_cancelacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;`,
      [e.nombre, e.descripcion, e.teatro, e.city_id, e.agent_id, e.fecha_inicio, e.fecha_fin,
       e.capacidad, e.precio, e.observaciones, e.estado, e.causa_cancelacion]
    );
    return this.getById(result.rows[0].id);
  }

  public async update(id: number, body: Record<string, unknown>): Promise<EventItem> {
    const current = await pool.query(`SELECT * FROM events WHERE id = $1;`, [id]);
    if (current.rows.length === 0) throw CustomError.notFound("Evento no encontrado");
    const row = current.rows[0];

    // Lo que no se envía se conserva
    const e = this.parse({
      ...row,
      fecha_inicio: row.fecha_inicio.toISOString(),
      fecha_fin: row.fecha_fin.toISOString(),
      ...body,
    });

    await withTransaction(async (db) => {
      await db.query(
        `UPDATE events SET nombre = $1, descripcion = $2, teatro = $3, city_id = $4, agent_id = $5,
                fecha_inicio = $6, fecha_fin = $7, capacidad = $8, precio = $9,
                observaciones = $10, estado = $11, causa_cancelacion = $12
         WHERE id = $13;`,
        [e.nombre, e.descripcion, e.teatro, e.city_id, e.agent_id, e.fecha_inicio, e.fecha_fin,
         e.capacidad, e.precio, e.observaciones, e.estado, e.causa_cancelacion, id]
      );

      // Si el evento se cancela, se cancelan también sus reservas
      if (e.estado === "Cancelado") {
        await db.query(
          `UPDATE reservations SET estado = 'Cancelada', causa_cancelacion = $2
           WHERE event_id = $1 AND estado <> 'Cancelada';`,
          [id, `Evento cancelado: ${e.causa_cancelacion}`]
        );
      }
    });

    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(`DELETE FROM events WHERE id = $1;`, [id]);
    if (result.rowCount === 0) throw CustomError.notFound("Evento no encontrado");
  }

  private parse(body: Record<string, unknown>) {
    const estado = body.estado === undefined ? "Programado" : Validators.oneOf(body.estado, "estado", EVENT_STATES);
    const fecha_inicio = Validators.date(body.fecha_inicio, "fecha_inicio");
    const fecha_fin = Validators.date(body.fecha_fin, "fecha_fin");

    if (fecha_fin <= fecha_inicio) {
      throw CustomError.badRequest("fecha_fin debe ser posterior a fecha_inicio");
    }

    return {
      nombre: Validators.text(body.nombre, "nombre", 150),
      descripcion: Validators.text(body.descripcion, "descripcion", 1000),
      teatro: Validators.text(body.teatro, "teatro", 120),
      city_id: Validators.id(body.city_id, "city_id"),
      agent_id: Validators.id(body.agent_id, "agent_id"),
      fecha_inicio,
      fecha_fin,
      capacidad: Validators.int(body.capacidad, "capacidad", 1),
      precio: Validators.int(body.precio, "precio", 0),
      observaciones: Validators.optionalText(body.observaciones, "observaciones"),
      estado,
      causa_cancelacion: estado === "Cancelado"
        ? Validators.text(body.causa_cancelacion, "causa_cancelacion", 500)
        : null,
    };
  }

}