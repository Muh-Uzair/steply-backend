import { Schema, model } from "mongoose";

// 1. TypeScript interface for the document
interface IForm {
  name: string;
}

// 2. Mongoose Schema
const formSchema = new Schema<IForm>(
  {
    name: {
      type: String,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      lowercase: true,
    },
  },
  { timestamps: true }
);

// 3. Mongoose model with TS generic
export const FormModel = model<IForm>("Form", formSchema);
