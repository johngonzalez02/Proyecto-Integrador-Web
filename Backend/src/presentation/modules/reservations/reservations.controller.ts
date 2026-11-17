import { CrudController } from "../shared/crud.controller";
import { ReservationsService } from "./reservations.service";

export class ReservationsController extends CrudController {
  constructor() {
    super(new ReservationsService());
  }
}