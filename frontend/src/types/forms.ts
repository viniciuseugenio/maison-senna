import { z } from "zod";
import { categorySchema } from "../schemas/category";
import newProductSchema from "../schemas/newProduct";

export type NewProductForm = z.infer<typeof newProductSchema>;

export type CategoryForm = z.infer<typeof categorySchema>;

export type CategoryFormError = {
  errors: Record<keyof CategoryForm, string[]>;
};
