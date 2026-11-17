import { Router } from "express";
import { ReservationsController } from "./reservations.controller";

export class ReservationsRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new ReservationsController();

    router.get("/reservations", controller.getAll);
    router.get("/reservations/:id", controller.getById);
    router.post("/reservations", controller.create);
    router.put("/reservations/:id", controller.update);
    router.delete("/reservations/:id", controller.delete);

    return router;
  }
}