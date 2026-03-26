import { z } from "zod";

export const variationKindsSchema = z.object({
  name: z.string().min(4),
  skuAbbr: z.string().max(3),
});
