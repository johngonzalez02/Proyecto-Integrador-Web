import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { Department } from "../../../domain/interfaces/location.interface";
import { Validators } from "../../../domain/utils/validators";

export class DepartmentsService {

  private readonly baseQuery = `
    SELECT d.id, d.nombre, d.country_id, c.nombre AS country
    FROM departments d
    INNER JOIN countries c ON c.id = d.country_id`;

  public async getAll(): Promise<Department[]> {
    const result = await pool.query(`${this.baseQuery} ORDER BY d.nombre;`);
    return result.rows;
  }

  public async getById(id: number): Promise<Department> {
    const result = await pool.query(`${this.baseQuery} WHERE d.id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound("Departamento no encontrado");
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<Department> {
    const nombre = Validators.text(body.nombre, "nombre", 100);
    const countryId = Validators.id(body.country_id, "country_id");
    const result = await pool.query(
      `INSERT INTO departments (nombre, country_id) VALUES ($1, $2) RETURNING id;`,
      [nombre, countryId]
    );
    return this.getById(result.rows[0].id);
  }

  public async update(id: number, body: Record<string, unknown>): Promise<Department> {
    const nombre = Validators.text(body.nombre, "nombre", 100);
    const countryId = Validators.id(body.country_id, "country_id");
    const result = await pool.query(
      `UPDATE departments SET nombre = $1, country_id = $2 WHERE id = $3;`,
      [nombre, countryId, id]
    );
    if (result.rowCount === 0) throw CustomError.notFound("Departamento no encontrado");
    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(`DELETE FROM departments WHERE id = $1;`, [id]);
    if (result.rowCount === 0) throw CustomError.notFound("Departamento no encontrado");
  }

}