import { z } from "zod";

export const variationKindsSchema = z.object({
  name: z.string().min(4),
});

export const newVariationType = z.object({
  kind: z.number({
    required_error: "You must select a variation kind",
  }),
  product: z.number({ required_error: "You must select a product" }),
});
