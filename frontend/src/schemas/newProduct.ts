import { z } from "zod";

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
  variations: z
    .array(
      z.object({
        id: z.string(),
        variationKind: z
          .number({
            invalid_type_error: "You have to select a variation kind",
          })
          .refine((val) => val !== 0, {
            message: "You have to select a variation kind",
          }),
        options: z
          .array(z.object({ id: z.string(), value: z.string() }))
          .min(1, "The variation must have at least one option")
          .refine(
            (options) => {
              const seen: string[] = [];
              for (const obj of options) {
                if (seen.includes(obj.value)) {
                  return false;
                }
                seen.push(obj.value);
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
        if (v.variationKind === null) return;
        if (seen.has(v.variationKind)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [idx, "variationKind"],
            message: "This variation kind is already used",
          });
        } else {
          seen.set(v.variationKind, idx);
        }
      });
    }),
});

const earrings = {
  id: 6,
  category: {
    id: 3,
    name: "Earrings",
    slug: "earrings",
  },
  name: "Luna Pearl Drop Earrings",
  slug: "luna-pearl-drop-earrings",
  basePrice: "950.00",
  referenceImage:
    "http://localhost:8000/media/catalog/products/luna-pearl-drop-earrings.jpg",
  description:
    "The Luna Pearl Drop Earrings blend timeless sophistication with modern minimalism, featuring lustrous freshwater pearls suspended from sleek gold hooks.",
  variationTypes: [
    {
      id: 11,
      kind: {
        id: 3,
        name: "Metal Type",
      },
      options: [
        { id: 28, name: "14k Yellow Gold", priceModifier: null },
        { id: 29, name: "14k White Gold", priceModifier: "100.00" },
        { id: 30, name: "Platinum", priceModifier: "250.00" },
      ],
    },
    {
      id: 12,
      kind: {
        id: 7,
        name: "Pearl Size",
      },
      options: [
        { id: 31, name: "8mm", priceModifier: null },
        { id: 32, name: "10mm", priceModifier: "120.00" },
      ],
    },
  ],
  details: [
    "Natural freshwater pearls",
    "Hand-polished gold hooks",
    "Secure push-back closure",
    "Available in two pearl sizes",
    "Delivered in satin jewelry pouch",
  ],
  materials: ["14k gold or platinum", "Freshwater pearls"],
  care: [
    "Avoid contact with hairspray and perfume",
    "Wipe with a clean soft cloth after each wear",
    "Store in a separate pouch to prevent scratches",
  ],
};
