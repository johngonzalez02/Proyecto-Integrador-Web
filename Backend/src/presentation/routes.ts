import { Router } from "express";
import { LocationRoutes } from "./modules/location/location.routes";
import { PersonsRoutes } from "./modules/persons/persons.routes";
import { EventsRoutes } from "./modules/events/events.routes";
import { ReservationsRoutes } from "./modules/reservations/reservations.routes";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { ReportsRoutes } from "./modules/reports/reports.routes";

export class AppRoutes {

  static get routes(): Router {
    const router = Router();
    const apiRouter = Router();

    // Definir rutas
    apiRouter.use("/", AuthRoutes.routes);
    apiRouter.use("/", LocationRoutes.routes);
    apiRouter.use("/", PersonsRoutes.routes);
    apiRouter.use("/", EventsRoutes.routes);
    apiRouter.use("/", ReservationsRoutes.routes);
    apiRouter.use("/", ReportsRoutes.routes);

    router.use("/api", apiRouter);

    return router;
  }
}