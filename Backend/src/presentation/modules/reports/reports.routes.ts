import { Router } from "express";
import { ReportsController } from "./reports.controller";

export class ReportsRoutes {

  static get routes(): Router {
    const router = Router();
    const controller = new ReportsController();

    router.get("/reports/summary", controller.summary);
    router.get("/reports/income-per-agent", controller.incomePerAgent);
    router.get("/reports/income-per-client", controller.incomePerClient);
    router.get("/reports/income-by-month", controller.incomeByMonth);
    router.get("/reports/reservations-by-event-month", controller.reservationsByEventMonth);
    router.get("/reports/events-by-agent-city", controller.eventsByAgentCity);
    router.get("/reports/events-by-location", controller.eventsByLocation);
    router.get("/reports/reservations-by-client", controller.reservationsByClient);
    router.get("/reports/cancelled-reservations", controller.cancelledReservations);
    router.get("/reports/cancelled-events", controller.cancelledEvents);

    return router;
  }
}