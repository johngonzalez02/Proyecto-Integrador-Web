import { CrudController } from "../shared/crud.controller";
import { AgentsService } from "./agents.service";

export class AgentsController extends CrudController {
  constructor() {
    super(new AgentsService());
  }
}