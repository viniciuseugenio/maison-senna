import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/auth";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  groups: string[];
};

export type UserContext = {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
};

export type LoginForm = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;

export type FieldErrors = {
  [fieldName: string]: string[];
};
