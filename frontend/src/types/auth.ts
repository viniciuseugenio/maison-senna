import { z } from "zod";
import { registerSchema, loginSchema } from "../schemas/auth";
import { SetStateAction } from "react";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UserContext = {
  user?: User;
  isAuthenticated?: boolean;
  setUser: React.Dispatch<SetStateAction<User | undefined>>;
  logout: () => void;
};

export type LoginForm = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;

export type FieldErrors = {
  [fieldName: string]: string[];
};
