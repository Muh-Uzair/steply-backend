import { Request, Response } from "express";

export const createNewForm = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};

export const getAllForms = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};

export const editFormOnId = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};

export const deleteFormOnId = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};
