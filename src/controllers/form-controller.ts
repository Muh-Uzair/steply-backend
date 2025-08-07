import { Request, Response, NextFunction } from "express";
import { FormModel } from "@/models/form-model";
import bcrypt from "bcrypt";

// FUNCTION
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

// FUNCTION
export const getAllForms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allForms = await FormModel.find()
      .select("fullName gender phoneNum country")
      .lean();

    res.status(200).json({
      status: "success",
      data: allForms,
    });
  } catch (err) {
    return next(err);
  }
};

interface IResumeFile {
  data: Buffer;
  mimetype: string;
  originalname: string;
}

// FUNCTION
export const getFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Form ID is required in request body",
      });
    }

    const form = await FormModel.findById(id).lean();

    if (!form) {
      return res.status(404).json({
        status: "error",
        message: "Form not found",
      });
    }

    const resumeFile = form.resume as any;

    console.log("Processing form resume:", {
      hasResume: !!resumeFile,
      resumeKeys: resumeFile ? Object.keys(resumeFile) : [],
      resumeType: typeof resumeFile,
      resumeData: resumeFile,
    });

    let processedResume = null;

    if (resumeFile && resumeFile.data) {
      let bufferData;
      let mimetype =
        resumeFile.mimetype || resumeFile.contentType || "application/pdf";
      let originalname =
        resumeFile.originalname || resumeFile.filename || "resume.pdf";

      if (resumeFile.data.buffer) {
        bufferData = Buffer.from(resumeFile.data.buffer);
      } else if (Buffer.isBuffer(resumeFile.data)) {
        bufferData = resumeFile.data;
      } else if (resumeFile.data.toString) {
        bufferData = Buffer.from(resumeFile.data);
      }

      console.log("Buffer processing:", {
        hasBuffer: !!bufferData,
        bufferLength: bufferData?.length,
        mimetype,
        originalname,
      });

      if (bufferData && bufferData.length > 0) {
        processedResume = {
          base64: bufferData.toString("base64"),
          mimetype,
          originalname,
          size: bufferData.length,
        };
      }
    }

    const formattedForm = {
      ...form,
      resume: processedResume,
    };

    console.log("Sending response with form");
    console.log(
      "Sample resume data:",
      formattedForm.resume
        ? {
            hasBase64: !!formattedForm.resume.base64,
            base64Length: formattedForm.resume.base64?.length,
            mimetype: formattedForm.resume.mimetype,
            originalname: formattedForm.resume.originalname,
          }
        : "No resume"
    );

    res.status(200).json({
      message: "Form fetched successfully",
      data: formattedForm,
    });
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch form",
    });
  }
};

// FUNCTION
export const editFormOnId = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};

// FUNCTION
export const deleteFormOnId = (req: Request, res: Response) => {
  res.status(200).json({
    message: "forms success",
  });
};
