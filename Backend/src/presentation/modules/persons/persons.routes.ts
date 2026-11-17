import { Router } from "express";
import { PersonsController } from "./persons.controller";
import { ClientsController } from "./clients.controller";
import { AgentsController } from "./agents.controller";
import { AdminsController } from "./admins.controller";

export class PersonsRoutes {

  static get routes(): Router {
    const router = Router();
    const persons = new PersonsController();
    const clients = new ClientsController();
    const agents = new AgentsController();
    const admins = new AdminsController();

    router.get("/persons", persons.getAll);
    router.get("/persons/:id", persons.getById);
    router.post("/persons", persons.create);
    router.put("/persons/:id", persons.update);
    router.delete("/persons/:id", persons.delete);

    router.get("/clients", clients.getAll);
    router.get("/clients/:id", clients.getById);
    router.post("/clients", clients.create);
    router.put("/clients/:id", clients.update);
    router.delete("/clients/:id", clients.delete);

    router.get("/agents", agents.getAll);
    router.get("/agents/:id", agents.getById);
    router.post("/agents", agents.create);
    router.put("/agents/:id", agents.update);
    router.delete("/agents/:id", agents.delete);

    router.get("/admins", admins.getAll);
    router.get("/admins/:id", admins.getById);
    router.post("/admins", admins.create);
    router.put("/admins/:id", admins.update);
    router.delete("/admins/:id", admins.delete);

    return router;
  }
}