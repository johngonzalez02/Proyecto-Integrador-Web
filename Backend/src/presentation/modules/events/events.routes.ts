import { Router } from "express";
import { EventsController } from "./events.controller";

export class EventsRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new EventsController();

    router.get("/events", controller.getAll);
    router.get("/events/:id", controller.getById);
    router.post("/events", controller.create);
    router.put("/events/:id", controller.update);
    router.delete("/events/:id", controller.delete);

    return router;
  }
}