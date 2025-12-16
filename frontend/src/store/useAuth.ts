import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "../types/auth";

export function useAuth() {
  const context = useContext<AuthContextType>(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside a AuthContextProvider");
  }

  return context;
}
