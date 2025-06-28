import { z } from "zod";

export default z.object({
  name: z.string().min(6, "The product name must have at least 6 characters."),
  base_price: z
    .string()
    .trim()
    .transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price must be a number.",
        });
        return z.NEVER;
      }
      return parsed;
    }),
  description: z
    .string()
    .min(24, "The product description must have at least 24 characters."),
  category: z.number({ required_error: "You must select a category!" }),
  details: z
    .array(z.string())
    .min(1, "The product must have at least one detail."),
  materials: z
    .array(z.string())
    .min(1, "The product must have at least one material in the list."),
  care: z
    .array(z.string())
    .min(1, "The product must have at least one care instruction."),
  reference_image: z
    .instanceof(File, { message: "An image is required." })
    .refine((file) => file.size > 0, { message: "An image is required." })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image.",
    }),
});
