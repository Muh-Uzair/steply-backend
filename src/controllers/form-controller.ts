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
export const editFormOnId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the form ID from route parameters
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Form ID is required",
      });
    }

    console.log("Req Body------------------------------------------------");
    console.log(req.body);

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

    // Check if the form exists
    const existingForm = await FormModel.findById(id);
    if (!existingForm) {
      return res.status(404).json({
        status: "fail",
        message: "Form not found",
      });
    }

    // Prepare update object
    const updateData: any = {};

    // Add fields to update object if they exist in request body
    if (fullName !== undefined) updateData.fullName = fullName;
    if (gender !== undefined) updateData.gender = gender;
    if (dob !== undefined) updateData.dob = dob;
    if (phoneNum !== undefined) updateData.phoneNum = phoneNum;
    if (alternatePhoneNum !== undefined)
      updateData.alternatePhoneNum = alternatePhoneNum;
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (currentJobTitle !== undefined)
      updateData.currentJobTitle = currentJobTitle;
    if (employmentStatus !== undefined)
      updateData.employmentStatus = employmentStatus;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (loanStatus !== undefined) updateData.loanStatus = loanStatus;
    if (preferredContact !== undefined)
      updateData.preferredContact = preferredContact;

    // Handle numeric fields with proper conversion
    if (yearsOfExperience !== undefined) {
      updateData.yearsOfExperience = Number(yearsOfExperience);
    }
    if (monthlyIncome !== undefined) {
      updateData.monthlyIncome = Number(monthlyIncome);
    }
    if (loanAmount !== undefined) {
      updateData.loanAmount = Number(loanAmount);
    }
    if (creditScore !== undefined) {
      updateData.creditScore = Number(creditScore);
    }

    // Handle boolean field
    if (newsLetterSubscription !== undefined) {
      updateData.newsLetterSubscription =
        newsLetterSubscription === "true" || newsLetterSubscription === true;
    }

    // Handle hobbies array
    if (hobbies !== undefined) {
      const parsedHobbies = Array.isArray(hobbies)
        ? hobbies
        : hobbies
        ? [hobbies]
        : [];
      updateData.hobbies = parsedHobbies;
    }

    // Handle password hashing if password is being updated
    if (password !== undefined && password !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Handle file upload (resume)
    if (req.file && req.file.buffer) {
      updateData.resume = {
        data: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
      };
    }

    // Update the form
    const updatedForm = await FormModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    });

    if (!updatedForm) {
      return res.status(404).json({
        status: "fail",
        message: "Form not found or could not be updated",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Form updated successfully",
      data: updatedForm,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// FUNCTION
export const deleteFormOnId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the form ID from route parameters
    const { id } = req.params;

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Form ID is required",
      });
    }

    // Check if the form exists before attempting to delete
    const existingForm = await FormModel.findById(id);
    if (!existingForm) {
      return res.status(404).json({
        status: "fail",
        message: "Form not found",
      });
    }

    // Delete the form
    await FormModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Form deleted successfully",
      data: null,
    });
  } catch (err: unknown) {
    next(err);
  }
};
