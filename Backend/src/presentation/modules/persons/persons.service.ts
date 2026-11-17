import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { Person } from "../../../domain/interfaces/person.interface";
import { withTransaction } from "../../../domain/utils/transaction";
import { PersonHelper, personSelect } from "./person.helper";

export class PersonsService {

  public async getAll(): Promise<Person[]> {
    const result = await pool.query(`${personSelect()} ORDER BY p.nombre;`);
    return result.rows;
  }

  public async getById(id: number): Promise<Person> {
    const result = await pool.query(`${personSelect()} WHERE p.id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound("Persona no encontrada");
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<Person> {
    const input = PersonHelper.parse(body, true);
    const id = await withTransaction((db) => PersonHelper.insert(db, input));
    return this.getById(id);
  }

  public async update(id: number, body: Record<string, unknown>): Promise<Person> {
    const input = PersonHelper.parse(body, false);
    await withTransaction((db) => PersonHelper.update(db, id, input));
    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(`DELETE FROM persons WHERE id = $1;`, [id]);
    if (result.rowCount === 0) throw CustomError.notFound("Persona no encontrada");
  }

}