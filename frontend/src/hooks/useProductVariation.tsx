import { queryKeys } from "@/api/queryKeys";
import { getProductVariationByOptions } from "@/api/services";
import { VariationOption } from "@/types";
import { groupOptions } from "@/utils/groupOptions";
import { getStockIndicatorColor } from "@/utils/getStockIndicatorColor";
import { useQuery } from "@tanstack/react-query";

type UseProductVariation = {
  optionsIds: number[];
  variationOptions: VariationOption[];
  productId: number;
};

export function useProductVariation({
  optionsIds,
  variationOptions,
  productId,
}: UseProductVariation) {
  const groupedOptions = groupOptions(variationOptions);

  const uniqueOptionsIds = [...new Set(optionsIds)];
  const variationsIds = variationOptions.map((v) => v.id);
  const existingIds = uniqueOptionsIds.filter((id) =>
    variationsIds.includes(id),
  );

  const isSelectionComplete = existingIds.length === groupedOptions.length;

  const {
    data: productVariation,
    isLoading: variationIsLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.productVariations.detailsByOptions(
      productId,
      existingIds,
    ),
    queryFn: () =>
      getProductVariationByOptions({ productId, options: existingIds }),
    enabled: isSelectionComplete,
  });

  const selectedOptions = variationOptions.filter((option) =>
    existingIds?.includes(option.id),
  );
  const additionalPrice = selectedOptions
    .map((option) => Number(option.priceModifier))
    .reduce((acc, cur) => acc + cur, 0);

  const baseText = !isSelectionComplete
    ? "Options Not Selected"
    : variationIsLoading
      ? "Loading..."
      : isError
        ? "Variation Not Found"
        : null;

  const skuText = baseText ?? productVariation?.sku ?? "Options Not Selected";
  const availabilityText =
    baseText ?? (productVariation?.stock > 0 ? "In Stock" : "Not Available");

  const stockTextColor =
    !variationIsLoading && isSelectionComplete
      ? getStockIndicatorColor(productVariation?.stock ?? 0, "text")
      : "text-mine-shaft/60";

  return {
    productVariation,
    variationIsLoading,
    skuText,
    additionalPrice,
    availabilityText,
    stockTextColor,
    isError,
    isAvailable:
      (productVariation?.stock ?? 0) > 0 || isError || isSelectionComplete,
  };
}
