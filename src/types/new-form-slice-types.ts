import { IFormData } from "./new-form-types";

export interface INewFormSlice {
  step: number;
  formData: IFormData;
}
