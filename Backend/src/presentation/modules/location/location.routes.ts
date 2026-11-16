import { Router } from "express";
import { CountriesController } from "./countries.controller";
import { DepartmentsController } from "./departments.controller";
import { CitiesController } from "./cities.controller";

export class LocationRoutes {

  static get routes(): Router {
    const router = Router();
    const countries = new CountriesController();
    const departments = new DepartmentsController();
    const cities = new CitiesController();

    router.get("/countries", countries.getAll);
    router.get("/countries/:id", countries.getById);
    router.post("/countries", countries.create);
    router.put("/countries/:id", countries.update);
    router.delete("/countries/:id", countries.delete);

    router.get("/departments", departments.getAll);
    router.get("/departments/:id", departments.getById);
    router.post("/departments", departments.create);
    router.put("/departments/:id", departments.update);
    router.delete("/departments/:id", departments.delete);

    router.get("/cities", cities.getAll);
    router.get("/cities/:id", cities.getById);
    router.post("/cities", cities.create);
    router.put("/cities/:id", cities.update);
    router.delete("/cities/:id", cities.delete);

    return router;
  }
}