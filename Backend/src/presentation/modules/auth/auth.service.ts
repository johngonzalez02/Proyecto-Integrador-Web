import { pool } from "../../../config/database";
import { CustomError } from "../../../domain/errors/custom.error";
import { Person } from "../../../domain/interfaces/person.interface";
import { Validators } from "../../../domain/utils/validators";
import { AgentsService } from "../persons/agents.service";
import { ClientsService } from "../persons/clients.service";
import { personSelect } from "../persons/person.helper";

export class AuthService {

  private readonly clients = new ClientsService();
  private readonly agents = new AgentsService();

  /** Valida correo y contraseña (comparada con el hash en la base de datos). */
  public async login(body: Record<string, unknown>): Promise<Person> {
    const correo = Validators.email(body.correo);
    const password = Validators.text(body.password, "password", 100);

    const result = await pool.query(
      `SELECT id FROM persons WHERE correo = $1 AND password = crypt($2, password);`,
      [correo, password]
    );
    if (result.rows.length === 0) {
      throw CustomError.unAuthorized("Correo o contraseña incorrectos");
    }

    const person = await this.getSession(result.rows[0].id);
    if (!person.rol) {
      throw CustomError.forbidden("El usuario no tiene un perfil asignado");
    }
    return person;
  }

  /** Registra un cliente o un agente. El administrador no se registra desde aquí. */
  public async register(body: Record<string, unknown>): Promise<Person> {
    const rol = Validators.oneOf(body.rol, "rol", ["client", "agent"] as const);

    if (rol === "client") {
      const client = await this.clients.create({
        ...body,
        puntos: 0,
        publicidad: body.publicidad ?? true,
      });
      return this.getSession(client.id);
    }

    const agent = await this.agents.create({
      ...body,
      comision: 0,
      experiencia: body.experiencia ?? 0,
    });
    return this.getSession(agent.id);
  }

  private async getSession(id: number): Promise<Person> {
    const result = await pool.query(`${personSelect()} WHERE p.id = $1;`, [id]);
    return result.rows[0];
  }

}