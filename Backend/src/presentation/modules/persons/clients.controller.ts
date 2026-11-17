import { CrudController } from "../shared/crud.controller";
import { ClientsService } from "./clients.service";

export class ClientsController extends CrudController {
  constructor() {
    super(new ClientsService());
  }
}