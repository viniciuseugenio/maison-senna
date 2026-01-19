import { z } from "zod";

const variationsSchema = z
  .array(
    z.object({
      idx: z.string(),
      kind: z
        .number({
          invalid_type_error: "You have to select a variation kind",
        })
        .refine((val) => val !== 0, {
          message: "You have to select a variation kind",
        }),
      options: z
        .array(
          z.object({
            idx: z.string(),
            id: z.number().optional(),
            name: z.string(),
          }),
        )
        .min(1, "The variation must have at least one option")
        .refine(
          (options) => {
            const seen: string[] = [];
            for (const obj of options) {
              if (seen.includes(obj.name)) {
                return false;
              }
              seen.push(obj.name);
            }
            return true;
          },
          { message: "Duplicate options are not accepted" },
        ),
    }),
  )
  .superRefine((vars, ctx) => {
    if (vars.length === 1) return;
    const seen = new Map<number, number>();
    vars.forEach((v, idx) => {
      if (v.kind === null) return;
      if (seen.has(v.kind)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [idx, "kind"],
          message: "This variation is already used",
        });
      } else {
        seen.set(v.kind, idx);
      }
    });
  });

export default z.object({
  name: z.string().min(6, "The product name must have at least 6 characters"),
  basePrice: z
    .string()
    .trim()
    .transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Price must be a number",
        });
        return z.NEVER;
      }
      return parsed;
    })
    .refine((val) => val >= 1, {
      message: "Price must be at least 1",
    })
    .transform((val) => val.toFixed(2)),
  description: z
    .string()
    .min(24, "The product description must have at least 24 characters"),
  category: z.number({ required_error: "You must select a category" }),
  details: z
    .array(z.string())
    .min(1, "The product must have at least one detail"),
  materials: z
    .array(z.string())
    .min(1, "The product must have at least one material in the list"),
  care: z
    .array(z.string())
    .min(1, "The product must have at least one care instruction"),
  referenceImage: z
    .instanceof(File, { message: "An image is required." })
    .refine((file) => file.size > 0, { message: "An image is required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    }),
  variations: variationsSchema,
});
