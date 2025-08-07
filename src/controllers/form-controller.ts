import { Request, Response } from "express";

export const createNewForm = (req: Request, res: Response) => {
  console.log("Body:", req.body); // all text fields
  console.log("File:", req.file); // resume file object
  console.log(req.body);
  res.status(200).json({
    message: "forms success",
  });
};

export const getAllForms = (req: Request, res: Response) => {
  const allForms = [
    { id: 1, form: "form1" },
    { id: 2, form: "form2" },
    { id: 3, form: "form3" },
    { id: 4, form: "form4" },
    { id: 5, form: "form5" },
  ];
  res.status(200).json({
    message: "forms success",
    data: allForms,
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
