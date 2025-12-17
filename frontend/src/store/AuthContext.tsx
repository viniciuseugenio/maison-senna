import { createContext } from "react";
import { useLogin } from "../hooks/auth";
import { User } from "../types/auth";

export interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  login: ReturnType<typeof useLogin>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
