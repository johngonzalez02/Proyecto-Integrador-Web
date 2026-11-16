import { Router } from "express";
import { LocationRoutes } from "./modules/location/location.routes";

export class AppRoutes {

  static get routes(): Router {
    const router = Router();
    const apiRouter = Router();

    // Definir rutas
    apiRouter.use("/", LocationRoutes.routes);

    router.use("/api", apiRouter);

    return router;
  }
}