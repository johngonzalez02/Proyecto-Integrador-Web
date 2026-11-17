import { CustomError } from "../../../domain/errors/custom.error";
import { AgentProfile } from "../../../domain/interfaces/person.interface";
import { Validators } from "../../../domain/utils/validators";
import { ProfileService, ProfileValues } from "./profile.service";

export class AgentsService extends ProfileService<AgentProfile> {

  protected readonly table = "agents";
  protected readonly columns = ["comision", "experiencia"];
  protected readonly label = "Agente";

  protected parseProfile(body: Record<string, unknown>): ProfileValues {
    const comision = Validators.int(body.comision, "comision", 0);
    if (comision > 100) throw CustomError.badRequest("comision debe estar entre 0 y 100");

    return {
      comision,
      experiencia: Validators.int(body.experiencia, "experiencia", 0),
    };
  }

}