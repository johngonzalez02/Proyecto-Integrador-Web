import { CrudController } from "../shared/crud.controller";
import { EventsService } from "./events.service";

export class EventsController extends CrudController {
  constructor() {
    super(new EventsService());
  }
}