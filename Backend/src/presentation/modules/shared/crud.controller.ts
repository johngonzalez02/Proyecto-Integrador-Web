import { Request, Response } from "express";
import { HandleError } from "../../../domain/errors/handle.error";
import { Validators } from "../../../domain/utils/validators";

export interface CrudService {
  getAll(): Promise<unknown[]>;
  getById(id: number): Promise<unknown>;
  create(body: Record<string, unknown>): Promise<unknown>;
  update(id: number, body: Record<string, unknown>): Promise<unknown>;
  delete(id: number): Promise<void>;
}

/**
 * Controlador genérico con las cinco operaciones CRUD.
 * Recibe peticiones HTTP, delega en el servicio y responde.
 */
export class CrudController {

  constructor(protected readonly service: CrudService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.service.getAll());
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Validators.id(req.params.id);
      res.status(200).json(await this.service.getById(id));
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(201).json(await this.service.create(req.body ?? {}));
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Validators.id(req.params.id);
      res.status(200).json(await this.service.update(id, req.body ?? {}));
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Validators.id(req.params.id);
      await this.service.delete(id);
      res.status(200).json({ message: "Registro eliminado correctamente" });
    } catch (error) {
      HandleError.error(error, res);
    }
  };

}