import { Request, Response } from "express";

export const createNewForm = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};
