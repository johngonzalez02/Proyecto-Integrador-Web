import { ClientProfile } from "../../../domain/interfaces/person.interface";
import { Validators } from "../../../domain/utils/validators";
import { ProfileService, ProfileValues } from "./profile.service";

export class ClientsService extends ProfileService<ClientProfile> {

  protected readonly table = "clients";
  protected readonly columns = ["puntos", "publicidad"];
  protected readonly label = "Cliente";

  protected parseProfile(body: Record<string, unknown>): ProfileValues {
    return {
      puntos: Validators.int(body.puntos ?? 0, "puntos", 0),
      publicidad: body.publicidad === undefined ? true : Validators.boolean(body.publicidad, "publicidad"),
    };
  }

}