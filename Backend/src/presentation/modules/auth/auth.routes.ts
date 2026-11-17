import { Router } from "express";
import { AuthController } from "./auth.controller";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new AuthController();

    router.post("/auth/login", controller.login);
    router.post("/auth/register", controller.register);

    return router;
  }
}