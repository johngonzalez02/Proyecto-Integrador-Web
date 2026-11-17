import { Request, Response } from "express";
import { HandleError } from "../../../domain/errors/handle.error";
import { AuthService } from "./auth.service";

export class AuthController {

  private readonly service = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.service.login(req.body ?? {}));
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(201).json(await this.service.register(req.body ?? {}));
    } catch (error) {
      HandleError.error(error, res);
    }
  };

}