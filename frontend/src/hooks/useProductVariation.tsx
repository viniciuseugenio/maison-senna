import { queryKeys } from "@/api/queryKeys";
import { getBaseVariation, getProductVariationByOptions } from "@/api/services";
import { VariationOption } from "@/types";
import { groupOptions } from "@/utils/groupOptions";
import { getStockIndicatorColor } from "@/utils/getStockIndicatorColor";
import { useQuery } from "@tanstack/react-query";

type UseProductVariation = {
  optionsIds: number[];
  variationOptions: VariationOption[] | [];
  productId: number;
};

function deriveStatus(params: {
  productHasOptions: boolean;
  isSelectionComplete: boolean;
  isLoading: boolean;
  isError: boolean;
  stock: number | undefined;
}): "selection_missing" | "loading" | "error" | "out_of_stock" | "in_stock" {
  const { productHasOptions, isSelectionComplete, isLoading, isError, stock } =
    params;

  if (productHasOptions && !isSelectionComplete) return "selection_missing";
  if (isLoading) return "loading";
  if (isError) return "error";
  if ((stock ?? 0) <= 0) return "out_of_stock";
  return "in_stock";
}

export function useProductVariation({
  optionsIds,
  variationOptions,
  productId,
}: UseProductVariation) {
  const productHasOptions = variationOptions.length > 0;
  const activeFlow = productHasOptions ? "options" : "base";
  const groupedOptions = groupOptions(variationOptions);

  const uniqueOptionsIds = [...new Set(optionsIds)];
  const variationsIds = variationOptions.map((v) => v.id);
  const existingIds = uniqueOptionsIds.filter((id) =>
    variationsIds.includes(id),
  );

  const isSelectionComplete = existingIds.length === groupedOptions.length;

  const {
    data: normalVariation,
    isLoading: variationIsLoading,
    isError: normalVariationError,
  } = useQuery({
    queryKey: queryKeys.productVariations.detailsByOptions(
      productId,
      existingIds,
    ),
    queryFn: () =>
      getProductVariationByOptions({ productId, options: existingIds }),
    enabled: activeFlow === "options" && isSelectionComplete,
  });

  const {
    data: baseVariation,
    isLoading: baseVariationIsLoading,
    isError: baseVariationError,
  } = useQuery({
    queryKey: queryKeys.productVariations.baseVariation(productId),
    queryFn: () => getBaseVariation(productId),
    enabled: activeFlow === "base",
  });

  const queryData = {
    options: {
      variation: normalVariation,
      isError: normalVariationError,
      isLoading: variationIsLoading,
    },
    base: {
      variation: baseVariation,
      isError: baseVariationError,
      isLoading: baseVariationIsLoading,
    },
  };

  const productVariation = queryData[activeFlow].variation;
  const isError = queryData[activeFlow].isError;
  const isLoading = queryData[activeFlow].isLoading;

  const selectedOptions = variationOptions.filter((option) =>
    existingIds?.includes(option.id),
  );
  const additionalPrice =
    activeFlow === "options"
      ? selectedOptions
          .map((option) => Number(option.priceModifier))
          .reduce((acc, cur) => acc + cur, 0)
      : 0;

  const status = deriveStatus({
    productHasOptions,
    isSelectionComplete,
    isLoading,
    isError,
    stock: productVariation?.stock,
  });

  const ui = {
    skuText:
      status === "selection_missing"
        ? "Options Not Selected"
        : status === "loading"
          ? "Loading..."
          : status === "error"
            ? "Variation Not Found"
            : (productVariation?.sku ?? "-"),

    availabilityText:
      status === "in_stock"
        ? "In Stock"
        : status === "out_of_stock"
          ? "Not Available"
          : status === "selection_missing"
            ? "Options Not Selected"
            : status === "loading"
              ? "Loading..."
              : "Variation Not Found",

    isAvailable: status === "in_stock",
  };

  const stockTextColor =
    status === "in_stock"
      ? getStockIndicatorColor(productVariation?.stock ?? 0, "text")
      : "text-mine-shaft/60";

  return {
    productVariation,
    isLoading,
    additionalPrice,
    stockTextColor,
    isError,
    status,
    ...ui,
  };
}
