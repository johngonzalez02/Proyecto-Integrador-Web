import { AdminProfile } from "../../../domain/interfaces/person.interface";
import { Validators } from "../../../domain/utils/validators";
import { ProfileService, ProfileValues } from "./profile.service";

export class AdminsService extends ProfileService<AdminProfile> {

  protected readonly table = "admins";
  protected readonly columns = ["salario", "horario"];
  protected readonly label = "Administrador";

  protected parseProfile(body: Record<string, unknown>): ProfileValues {
    return {
      salario: Validators.int(body.salario, "salario", 0),
      horario: Validators.text(body.horario, "horario", 100),
    };
  }

}