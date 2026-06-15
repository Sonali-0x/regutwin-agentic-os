import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  const user = await AuthService.register(req.body);

  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body.email, req.body.password);

  res.status(200).json(result);
};
