export interface IFormData {
  fullName: string;
  password: string;
  confirmPassword: string;
  gender: "Male" | "Female" | "Other";
  dob: string | null;

  phoneNum: string;
  alternatePhoneNum: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  postalCode: string;

  currentJobTitle: string;
  employmentStatus: "Employed" | "Unemployed" | "Student";
  companyName: string;
  yearsOfExperience: number;
  resume: File | null;

  monthlyIncome: number;
  loanStatus: "Yes" | "No";
  loanAmount: number;
  creditScore: number;

  preferredContact: "Email" | "Phone" | "SMS";
  hobbies: string[];
  newsLetterSubscription: boolean;
}
