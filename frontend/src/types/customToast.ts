import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent } from "react";

export type ToastProps = {
  variant: "warning" | "info" | "success" | "error";
  id: string | number;
  title: string;
  description?: string;
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

export type ToastVariant = "success" | "error" | "info" | "warning";

export type ToastObjectProps = {
  title: string;
  description?: string;
  customId?: string;
  Icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};
