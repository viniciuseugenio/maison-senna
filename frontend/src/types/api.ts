import { NewProductForm } from "./forms";

export type ApiResponse = {
  detail: string;
  description?: string;
  [key: string]: unknown;
};

export type ApiFormError = {
  errors: Partial<Record<keyof NewProductForm, string[]>>;
};

export type ApiError = {
  name: "ApiError";
  title: string;
  description?: string;
  status: number;
};
