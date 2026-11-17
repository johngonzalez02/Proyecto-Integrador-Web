import { CrudController } from "../shared/crud.controller";
import { AdminsService } from "./admins.service";

export class AdminsController extends CrudController {
  constructor() {
    super(new AdminsService());
  }
}