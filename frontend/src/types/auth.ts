import { loginSchema, registerSchema } from "@/schemas/auth";
import { z } from "zod";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  groups: string[];
};

export type LoginForm = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;

export type FieldErrors = {
  [fieldName: string]: string[];
};
