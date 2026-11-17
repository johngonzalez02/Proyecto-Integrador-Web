import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { RESERVATION_STATES, ReservationItem } from "../../../domain/interfaces/reservation.interface";
import { Validators } from "../../../domain/utils/validators";
import { withTransaction } from "../../../domain/utils/transaction";
import { CrudService } from "../shared/crud.controller";

interface EventLock {
  id: number;
  capacidad: number;
  precio: number;
  estado: string;
}

export class ReservationsService implements CrudService {

  private readonly baseQuery = `
    SELECT r.id, r.fecha, r.total, r.entradas, r.observaciones, r.estado, r.causa_cancelacion,
           r.client_id, pc.nombre AS cliente, pc.correo,
           r.event_id, e.nombre AS evento, e.teatro, ci.nombre AS ciudad,
           e.fecha_inicio, e.precio
    FROM reservations r
    INNER JOIN persons pc ON pc.id = r.client_id
    INNER JOIN events e ON e.id = r.event_id
    INNER JOIN cities ci ON ci.id = e.city_id`;

  public async getAll(query: Record<string, unknown> = {}): Promise<ReservationItem[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (query.client_id) {
      params.push(Validators.id(query.client_id, "client_id"));
      conditions.push(`r.client_id = $${params.length}`);
    }
    if (query.event_id) {
      params.push(Validators.id(query.event_id, "event_id"));
      conditions.push(`r.event_id = $${params.length}`);
    }
    if (query.estado) {
      params.push(Validators.oneOf(query.estado, "estado", RESERVATION_STATES));
      conditions.push(`r.estado = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await pool.query(`${this.baseQuery} ${where} ORDER BY r.fecha DESC;`, params);
    return result.rows;
  }

  public async getById(id: number): Promise<ReservationItem> {
    const result = await pool.query(`${this.baseQuery} WHERE r.id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound("Reserva no encontrada");
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<ReservationItem> {
    const clientId = Validators.id(body.client_id, "client_id");
    const eventId = Validators.id(body.event_id, "event_id");
    const entradas = Validators.int(body.entradas, "entradas", 1);
    const observaciones = Validators.optionalText(body.observaciones, "observaciones");
    const estado = body.estado === undefined ? "Reservada" : Validators.oneOf(body.estado, "estado", RESERVATION_STATES);
    const causa = this.causa(estado, body.causa_cancelacion);

    const id = await withTransaction(async (db) => {
      const event = await this.lockEvent(db, eventId);

      if (event.estado === "Cancelado" || event.estado === "Finalizado") {
        throw CustomError.badRequest(`No se puede reservar un evento ${event.estado.toLowerCase()}`);
      }
      if (estado !== "Cancelada") {
        await this.checkCapacity(db, event, entradas, null);
      }

      const result = await db.query(
        `INSERT INTO reservations (client_id, event_id, total, entradas, observaciones, estado, causa_cancelacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
        [clientId, eventId, event.precio * entradas, entradas, observaciones, estado, causa]
      );
      return result.rows[0].id as number;
    });

    return this.getById(id);
  }

  public async update(id: number, body: Record<string, unknown>): Promise<ReservationItem> {
    await withTransaction(async (db) => {
      const found = await db.query(`SELECT * FROM reservations WHERE id = $1 FOR UPDATE;`, [id]);
      if (found.rows.length === 0) throw CustomError.notFound("Reserva no encontrada");
      const current = found.rows[0];

      // Lo que no se envía se conserva
      const entradas = body.entradas === undefined ? current.entradas : Validators.int(body.entradas, "entradas", 1);
      const observaciones = body.observaciones === undefined
        ? current.observaciones
        : Validators.optionalText(body.observaciones, "observaciones");
      const estado = body.estado === undefined
        ? current.estado
        : Validators.oneOf(body.estado, "estado", RESERVATION_STATES);
      const causa = this.causa(
        estado,
        body.causa_cancelacion === undefined ? current.causa_cancelacion : body.causa_cancelacion
      );

      const event = await this.lockEvent(db, current.event_id);
      if (estado !== "Cancelada") {
        await this.checkCapacity(db, event, entradas, id);
      }

      const total = entradas === current.entradas ? current.total : event.precio * entradas;

      await db.query(
        `UPDATE reservations SET total = $1, entradas = $2, observaciones = $3, estado = $4, causa_cancelacion = $5
         WHERE id = $6;`,
        [total, entradas, observaciones, estado, causa, id]
      );
    });

    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(`DELETE FROM reservations WHERE id = $1;`, [id]);
    if (result.rowCount === 0) throw CustomError.notFound("Reserva no encontrada");
  }

  /** Una reserva cancelada siempre debe indicar la causa. */
  private causa(estado: string, value: unknown): string | null {
    if (estado !== "Cancelada") return null;
    return Validators.text(value, "causa_cancelacion", 500);
  }

  /** Bloquea la fila del evento para que dos reservas simultáneas no superen la capacidad. */
  private async lockEvent(db: PoolClient, eventId: number): Promise<EventLock> {
    const result = await db.query(
      `SELECT id, capacidad, precio, estado FROM events WHERE id = $1 FOR UPDATE;`,
      [eventId]
    );
    if (result.rows.length === 0) throw CustomError.notFound("Evento no encontrado");
    return result.rows[0];
  }

  private async checkCapacity(db: PoolClient, event: EventLock, entradas: number, excludeId: number | null): Promise<void> {
    const result = await db.query(
      `SELECT COALESCE(SUM(entradas), 0)::int AS usadas
       FROM reservations
       WHERE event_id = $1 AND estado <> 'Cancelada' AND ($2::int IS NULL OR id <> $2);`,
      [event.id, excludeId]
    );
    const disponibles = event.capacidad - result.rows[0].usadas;
    if (entradas > disponibles) {
      throw CustomError.conflict(`Solo quedan ${disponibles} entradas disponibles`);
    }
  }

}