import { Request, Response } from "express";
import { FormModel } from "@/models/form-model";
import bcrypt from "bcrypt";

export const createNewForm = async (req: Request, res: Response) => {
  try {
    // Destructure the fields from req.body
    const {
      fullName,
      password,
      gender,
      dob,
      phoneNum,
      alternatePhoneNum,
      addressLine1,
      addressLine2,
      country,
      city,
      postalCode,
      currentJobTitle,
      employmentStatus,
      companyName,
      yearsOfExperience,
      monthlyIncome,
      loanStatus,
      loanAmount,
      creditScore,
      preferredContact,
      hobbies,
      newsLetterSubscription,
    } = req.body;

    // File info from multer
    const resume =
      req.file && req.file.buffer
        ? {
            data: req.file.buffer,
            mimetype: req.file.mimetype, // Changed from contentType to mimetype
            originalname: req.file.originalname, // Changed from filename to originalname
          }
        : null;

    // Ensure hobbies is an array
    const parsedHobbies = Array.isArray(hobbies)
      ? hobbies
      : hobbies
      ? [hobbies]
      : [];

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new document
    const newForm = await FormModel.create({
      fullName,
      password: hashedPassword,
      gender,
      dob,
      phoneNum,
      alternatePhoneNum,
      addressLine1,
      addressLine2,
      country,
      city,
      postalCode,
      currentJobTitle,
      employmentStatus,
      companyName,
      yearsOfExperience: Number(yearsOfExperience),
      resume,
      monthlyIncome: Number(monthlyIncome),
      loanStatus,
      loanAmount: Number(loanAmount),
      creditScore: Number(creditScore),
      preferredContact,
      hobbies: parsedHobbies,
      newsLetterSubscription: newsLetterSubscription === "true",
    });

    res.status(201).json({
      status: "success",
      data: newForm,
    });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while creating the form",
    });
  }
};

interface IResumeFile {
  data: Buffer;
  mimetype: string;
  originalname: string;
}

export const getAllForms = async (req: Request, res: Response) => {
  try {
    const forms = await FormModel.find().lean();

    const formattedForms = forms.map((form) => {
      const resumeFile = form.resume as unknown as IResumeFile | null;

      console.log("Processing form resume:", {
        hasResume: !!resumeFile,
        originalname: resumeFile?.originalname,
        mimetype: resumeFile?.mimetype,
        dataLength: resumeFile?.data?.length,
      });

      return {
        ...form,
        resume:
          resumeFile && resumeFile.data
            ? {
                base64: resumeFile.data.toString("base64"),
                mimetype: resumeFile.mimetype || "application/pdf",
                originalname: resumeFile.originalname || "resume.pdf",
                size: resumeFile.data.length, // Add file size
              }
            : null,
      };
    });

    console.log("Sending response with forms:", formattedForms.length);

    res.status(200).json({
      status: "success",
      message: "Forms fetched successfully",
      data: formattedForms,
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch forms",
    });
  }
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
