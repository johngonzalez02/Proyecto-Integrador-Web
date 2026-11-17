import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { withTransaction } from "../../../domain/utils/transaction";
import { PersonHelper, personSelect } from "./person.helper";

export type ProfileValues = Record<string, string | number | boolean>;

/**
 * Servicio base para los perfiles de persona (cliente, agente, administrador).
 * Cada perfil se guarda en su propia tabla, con la misma clave que persons.
 */
export abstract class ProfileService<T> {

  protected abstract readonly table: string;
  protected abstract readonly columns: string[];
  protected abstract readonly label: string;
  protected abstract parseProfile(body: Record<string, unknown>): ProfileValues;

  private select(): string {
    const extra = this.columns.map((c) => `, pr.${c}`).join("");
    return personSelect(extra, `INNER JOIN ${this.table} pr ON pr.person_id = p.id`);
  }

  public async getAll(): Promise<T[]> {
    const result = await pool.query(`${this.select()} ORDER BY p.nombre;`);
    return result.rows;
  }

  public async getById(id: number): Promise<T> {
    const result = await pool.query(`${this.select()} WHERE p.id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound(`${this.label} no encontrado`);
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<T> {
    const person = PersonHelper.parse(body, true);
    const profile = this.parseProfile(body);

    const id = await withTransaction(async (db) => {
      const personId = await PersonHelper.insert(db, person);
      const cols = Object.keys(profile);
      const marks = cols.map((_, i) => `$${i + 2}`).join(", ");
      await db.query(
        `INSERT INTO ${this.table} (person_id, ${cols.join(", ")}) VALUES ($1, ${marks});`,
        [personId, ...Object.values(profile)]
      );
      return personId;
    });

    return this.getById(id);
  }

  public async update(id: number, body: Record<string, unknown>): Promise<T> {
    const person = PersonHelper.parse(body, false);
    const profile = this.parseProfile(body);

    await withTransaction(async (db) => {
      const exists = await db.query(`SELECT 1 FROM ${this.table} WHERE person_id = $1;`, [id]);
      if (exists.rowCount === 0) throw CustomError.notFound(`${this.label} no encontrado`);

      await PersonHelper.update(db, id, person);

      const cols = Object.keys(profile);
      const sets = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
      await db.query(
        `UPDATE ${this.table} SET ${sets} WHERE person_id = $${cols.length + 1};`,
        [...Object.values(profile), id]
      );
    });

    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(
      `DELETE FROM persons WHERE id IN (SELECT person_id FROM ${this.table} WHERE person_id = $1);`,
      [id]
    );
    if (result.rowCount === 0) throw CustomError.notFound(`${this.label} no encontrado`);
  }

}