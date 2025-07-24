import { z } from "zod";
import { categorySchema } from "../schemas/category";
import newProductSchema from "../schemas/newProduct";
import {
  newVariationType,
  variationKindsSchema,
} from "../schemas/variationTypes";

export type NewProductForm = z.infer<typeof newProductSchema>;

export type CategoryForm = z.infer<typeof categorySchema>;

export type CategoryFormError = {
  errors: Record<keyof CategoryForm, string[]>;
};

export type VariationKindsForm = z.infer<typeof variationKindsSchema>;

export type VariationKindsFormError = {
  errors: Record<keyof VariationKindsForm, string[]>;
};

export type NewVariationTypeForm = z.infer<typeof newVariationType>;
