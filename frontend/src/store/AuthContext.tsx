import { User } from "@/types/auth";
import { useLogin } from "@hooks/auth";
import { createContext } from "react";

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
