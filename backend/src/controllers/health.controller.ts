import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json(
    ApiResponse.success({
      status: "OK",
      uptime: process.uptime(),
    })
  );
};
