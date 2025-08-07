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
      const resumeFile = form.resume as any;

      console.log("Processing form resume:", {
        hasResume: !!resumeFile,
        resumeKeys: resumeFile ? Object.keys(resumeFile) : [],
        resumeType: typeof resumeFile,
        resumeData: resumeFile,
      });

      // Handle different possible data structures
      let processedResume = null;

      if (resumeFile && resumeFile.data) {
        let bufferData;
        let mimetype =
          resumeFile.mimetype || resumeFile.contentType || "application/pdf";
        let originalname =
          resumeFile.originalname || resumeFile.filename || "resume.pdf";

        // Handle MongoDB Binary data
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
            mimetype: mimetype,
            originalname: originalname,
            size: bufferData.length,
          };
        }
      }

      return {
        ...form,
        resume: processedResume,
      };
    });

    console.log("Sending response with forms:", formattedForms.length);
    console.log(
      "Sample resume data:",
      formattedForms[0]?.resume
        ? {
            hasBase64: !!formattedForms[0].resume.base64,
            base64Length: formattedForms[0].resume.base64?.length,
            mimetype: formattedForms[0].resume.mimetype,
            originalname: formattedForms[0].resume.originalname,
          }
        : "No resume"
    );

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
