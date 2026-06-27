export type Lang = "he" | "en";

export type Gender = "male" | "female";

export type MaritalStatus =
  | "married"
  | "widowed"
  | "divorced"
  | "single_parent"
  | "married_children"
  | "divorced_children";

export interface Child {
  id: string;
  name: string;
}

export interface SecurityQA {
  id: string;
  question: string;
  answer: string;
  custom?: boolean;
}

export interface Profile {
  lang: Lang;
  name: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  spouseName: string;
  children: Child[];
  email: string;
  address: string;
  zip: string;
  phone: string;
  securityQuestions: SecurityQA[];
  createdAt: number;
}

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  notes: string;
  createdAt: number;
}
