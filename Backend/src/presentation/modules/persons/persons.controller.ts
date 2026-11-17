import { CrudController } from "../shared/crud.controller";
import { PersonsService } from "./persons.service";

export class PersonsController extends CrudController {
  constructor() {
    super(new PersonsService());
  }
}