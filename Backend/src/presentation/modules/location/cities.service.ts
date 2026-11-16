import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { City } from "../../../domain/interfaces/location.interface";
import { Validators } from "../../../domain/utils/validators";

export class CitiesService {

  private readonly baseQuery = `
    SELECT ci.id, ci.nombre, ci.department_id, d.nombre AS department,
           d.country_id, co.nombre AS country
    FROM cities ci
    INNER JOIN departments d ON d.id = ci.department_id
    INNER JOIN countries co ON co.id = d.country_id`;

  public async getAll(): Promise<City[]> {
    const result = await pool.query(`${this.baseQuery} ORDER BY ci.nombre;`);
    return result.rows;
  }

  public async getById(id: number): Promise<City> {
    const result = await pool.query(`${this.baseQuery} WHERE ci.id = $1;`, [id]);
    if (result.rows.length === 0) throw CustomError.notFound("Ciudad no encontrada");
    return result.rows[0];
  }

  public async create(body: Record<string, unknown>): Promise<City> {
    const nombre = Validators.text(body.nombre, "nombre", 100);
    const departmentId = Validators.id(body.department_id, "department_id");
    const result = await pool.query(
      `INSERT INTO cities (nombre, department_id) VALUES ($1, $2) RETURNING id;`,
      [nombre, departmentId]
    );
    return this.getById(result.rows[0].id);
  }

  public async update(id: number, body: Record<string, unknown>): Promise<City> {
    const nombre = Validators.text(body.nombre, "nombre", 100);
    const departmentId = Validators.id(body.department_id, "department_id");
    const result = await pool.query(
      `UPDATE cities SET nombre = $1, department_id = $2 WHERE id = $3;`,
      [nombre, departmentId, id]
    );
    if (result.rowCount === 0) throw CustomError.notFound("Ciudad no encontrada");
    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await pool.query(`DELETE FROM cities WHERE id = $1;`, [id]);
    if (result.rowCount === 0) throw CustomError.notFound("Ciudad no encontrada");
  }

}