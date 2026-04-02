import { VariationWarningContext } from "@/store/VariationWarningContext";
import { useContext } from "react";

export function useVariationWarning() {
  const ctx = useContext(VariationWarningContext);
  if (!ctx) throw new Error("useVariationWarning must be used within provider");
  return ctx;
}
