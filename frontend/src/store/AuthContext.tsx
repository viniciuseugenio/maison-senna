import { createContext } from "react";
import { UserContext as UserContextType } from "../types/auth";

export const AuthContext = createContext<UserContextType | undefined>(
  undefined,
);
