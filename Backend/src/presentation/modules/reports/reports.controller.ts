import { Request, Response } from "express";
import { HandleError } from "../../../domain/errors/handle.error";
import { ReportsService } from "./reports.service";

export class ReportsController {

  private readonly service = new ReportsService();

  /** Envuelve cada reporte con el manejo de respuesta y errores. */
  private respond(report: (req: Request) => Promise<unknown>) {
    return async (req: Request, res: Response): Promise<void> => {
      try {
        res.status(200).json(await report(req));
      } catch (error) {
        HandleError.error(error, res);
      }
    };
  }

  summary = this.respond(() => this.service.summary());
  incomePerAgent = this.respond(() => this.service.incomePerAgent());
  incomePerClient = this.respond(() => this.service.incomePerClient());
  incomeByMonth = this.respond((req) => this.service.incomeByMonth(req.query as Record<string, unknown>));
  reservationsByEventMonth = this.respond((req) => this.service.reservationsByEventMonth(req.query as Record<string, unknown>));
  eventsByAgentCity = this.respond(() => this.service.eventsByAgentCity());
  eventsByLocation = this.respond(() => this.service.eventsByLocation());
  reservationsByClient = this.respond((req) => this.service.reservationsByClient(req.query as Record<string, unknown>));
  cancelledReservations = this.respond(() => this.service.cancelledReservations());
  cancelledEvents = this.respond(() => this.service.cancelledEvents());

}