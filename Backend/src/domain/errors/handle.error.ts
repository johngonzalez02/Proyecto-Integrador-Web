import { Response } from "express";
import { CustomError } from "./custom.error";

/**
 * Manejador centralizado de errores HTTP.
 * Procesa errores personalizados, errores de PostgreSQL y errores no controlados.
 */
export class HandleError {

  static error(error: unknown, res: Response) {
    console.log(`${error}`);

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    const code = (error as { code?: string } | null)?.code;

    switch (code) {
      case "23505":
        return res.status(409).json({ error: "Ya existe un registro con esos datos únicos" });
      case "23503":
        return res.status(409).json({ error: "La operación viola una relación: el registro referenciado no existe o tiene registros asociados" });
      case "23502":
      case "23514":
      case "22P02":
      case "22007":
        return res.status(400).json({ error: "Los datos enviados no son válidos" });
    }

    return res.status(500).json({ error: "Internal Server error" });
  }
}