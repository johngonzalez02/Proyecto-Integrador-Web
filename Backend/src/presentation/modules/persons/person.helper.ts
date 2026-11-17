import { PoolClient } from "pg";
import { CustomError } from "../../../domain/errors/custom.error";
import { Validators } from "../../../domain/utils/validators";

export interface PersonInput {
  identificacion: string;
  nombre: string;
  correo: string;
  direccion: string;
  city_id: number;
  password?: string;
  telefonos?: string[];
}

/** Consulta base de personas con ciudad, departamento, país, teléfonos y rol. */
export const personSelect = (extraColumns = "", extraJoin = ""): string => `
  SELECT p.id, p.identificacion, p.nombre, p.correo, p.direccion, p.city_id,
         ci.nombre AS city, d.nombre AS department, co.nombre AS country,
         COALESCE(
           (SELECT array_agg(ph.telefono ORDER BY ph.id)::text[]
            FROM person_phones ph WHERE ph.person_id = p.id),
           ARRAY[]::text[]
         ) AS telefonos,
         CASE
           WHEN EXISTS (SELECT 1 FROM clients x WHERE x.person_id = p.id) THEN 'client'
           WHEN EXISTS (SELECT 1 FROM agents x WHERE x.person_id = p.id) THEN 'agent'
           WHEN EXISTS (SELECT 1 FROM admins x WHERE x.person_id = p.id) THEN 'admin'
           ELSE NULL
         END AS rol
         ${extraColumns}
  FROM persons p
  INNER JOIN cities ci ON ci.id = p.city_id
  INNER JOIN departments d ON d.id = ci.department_id
  INNER JOIN countries co ON co.id = d.country_id
  ${extraJoin}`;

export class PersonHelper {

  /** Valida los datos comunes de una persona. */
  static parse(body: Record<string, unknown>, requirePassword: boolean): PersonInput {
    const input: PersonInput = {
      identificacion: Validators.text(body.identificacion, "identificacion", 20),
      nombre: Validators.text(body.nombre, "nombre", 150),
      correo: Validators.email(body.correo),
      direccion: Validators.text(body.direccion, "direccion", 200),
      city_id: Validators.id(body.city_id, "city_id"),
    };

    const hasPassword = body.password !== undefined && body.password !== "";
    if (requirePassword || hasPassword) {
      const password = body.password;
      if (typeof password !== "string" || password.length < 6 || password.length > 100) {
        throw CustomError.badRequest("password debe tener entre 6 y 100 caracteres");
      }
      input.password = password;
    }

    if (body.telefonos !== undefined) {
      if (!Array.isArray(body.telefonos)) {
        throw CustomError.badRequest("telefonos debe ser una lista");
      }
      input.telefonos = body.telefonos.map((t, i) => Validators.text(t, `telefonos[${i}]`, 20));
    }

    return input;
  }

  static async insert(db: PoolClient, input: PersonInput): Promise<number> {
    const result = await db.query(
      `INSERT INTO persons (identificacion, nombre, correo, password, direccion, city_id)
       VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6) RETURNING id;`,
      [input.identificacion, input.nombre, input.correo, input.password, input.direccion, input.city_id]
    );
    const id: number = result.rows[0].id;
    await PersonHelper.setPhones(db, id, input.telefonos ?? []);
    return id;
  }

  static async update(db: PoolClient, id: number, input: PersonInput): Promise<void> {
    const params: unknown[] = [input.identificacion, input.nombre, input.correo, input.direccion, input.city_id, id];
    let sql = `UPDATE persons SET identificacion = $1, nombre = $2, correo = $3, direccion = $4, city_id = $5`;

    if (input.password) {
      params.push(input.password);
      sql += `, password = crypt($7, gen_salt('bf'))`;
    }
    sql += ` WHERE id = $6;`;

    const result = await db.query(sql, params);
    if (result.rowCount === 0) throw CustomError.notFound("Persona no encontrada");

    if (input.telefonos !== undefined) {
      await PersonHelper.setPhones(db, id, input.telefonos);
    }
  }

  private static async setPhones(db: PoolClient, personId: number, telefonos: string[]): Promise<void> {
    await db.query(`DELETE FROM person_phones WHERE person_id = $1;`, [personId]);
    for (const telefono of telefonos) {
      await db.query(`INSERT INTO person_phones (person_id, telefono) VALUES ($1, $2);`, [personId, telefono]);
    }
  }

}