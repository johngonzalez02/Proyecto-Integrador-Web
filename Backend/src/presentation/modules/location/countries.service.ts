import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { Country } from "../../../domain/interfaces/location.interface";
import { Validators } from "../../../domain/utils/validators";

export class CountriesService {

  public async getAll(): Promise<Country[]> {
    const result = await pool.query(`SELECT id, nombre FROM countries ORDER BY nombre;`);
    return result.rows;
  }

  public async getById(id: number): Promise<Country> {
    const result = await pool.query(`SELECT id, nombre FROM countries WHERE id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound("País no encontrado");
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<Country> {
    const nombre = Validators.text(body.nombre, "nombre", 100);
    const result = await pool.query(
      `INSERT INTO countries (nombre) VALUES ($1) RETURNING id, nombre;`,
      [nombre]
    );
    return result.rows[0];
  }

  public async update(id: number, body: Record<string, unknown>): Promise<Country> {
    const nombre = Validators.text(body.nombre, "nombre", 100);
    const result = await pool.query(
      `UPDATE countries SET nombre = $1 WHERE id = $2 RETURNING id, nombre;`,
      [nombre, id]
    );
    if (result.rowCount === 0) throw CustomError.notFound("País no encontrado");
    return result.rows[0];
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(`DELETE FROM countries WHERE id = $1;`, [id]);
    if (result.rowCount === 0) throw CustomError.notFound("País no encontrado");
  }

}