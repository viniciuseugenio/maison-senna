import { VariationOption } from "@/types";

export const calcVariantPrice = (
  basePrice: number,
  options: VariationOption[],
) => {
  return options.reduce(
    (acc, option) => acc + Number(option.priceModifier),
    basePrice,
  );
};
