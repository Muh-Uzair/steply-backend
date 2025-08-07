import { IFormData } from "@/types/new-form-types";
import { Schema, model } from "mongoose";
import validator from "validator";

// Custom type for file since `File` is a browser object
const ResumeSchema = new Schema(
  {
    data: Buffer,
    mimetype: String,
    originalname: String,
  },
  { _id: false }
);

// Mongoose Schema
const formSchema = new Schema<IFormData>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    confirmPassword: {
      type: String,
      validate: {
        validator(this: any, val: string) {
          return val === this.password;
        },
        message: "Passwords do not match",
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dob: {
      type: Date,
    },

    phoneNum: {
      type: String,
      required: true,
      validate: {
        validator: (val: string) => validator.isMobilePhone(val),
        message: "Invalid phone number",
      },
    },
    alternatePhoneNum: {
      type: String,
    },

    addressLine1: { type: String, required: true },
    addressLine2: { type: String },

    country: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: {
      type: String,
      validate: {
        validator: (val: string) => validator.isPostalCode(val, "any"),
        message: "Invalid postal code",
      },
    },

    currentJobTitle: { type: String },
    employmentStatus: {
      type: String,
      enum: ["Employed", "Unemployed", "Student"],
      required: true,
    },
    companyName: { type: String },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: [0, "Years of experience cannot be negative"],
    },

    resume: ResumeSchema, // { data, mimetype, originalname }

    monthlyIncome: {
      type: Number,
      required: true,
      min: [0, "Income must be positive"],
    },
    loanStatus: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    loanAmount: {
      type: Number,
      min: [0, "Loan amount must be positive"],
    },
    creditScore: {
      type: Number,
      min: [0, "Credit score must be between 0 and 1000"],
      max: [1000, "Credit score must be between 0 and 1000"],
    },

    preferredContact: {
      type: String,
      enum: ["Email", "Phone", "SMS"],
      required: true,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    newsLetterSubscription: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false, // remove __v
    toJSON: {
      transform(doc, ret) {
        delete (ret as any).password;
        delete (ret as any).confirmPassword;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Mongoose Model
export const FormModel = model<IFormData>("Form", formSchema);
