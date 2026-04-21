import { VariationOption } from "@/types";
import { groupOptions } from "@/utils/groupOptions";
import VariantButton from "./VariantButton";
import { formatPrice } from "@/utils/formatPrice";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/_app/products/$slug");

const ProductVariations: React.FC<{
  variationOptions: VariationOption[];
}> = ({ variationOptions }) => {
  const groupedOptions = groupOptions(variationOptions);
  const { options = [] } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const toggleVariationId = (optionId: number) => {
    const group = groupedOptions.find(([, options]) =>
      options.some((o) => o.id === optionId),
    );

    if (!group) return;

    const [, optionsInGroup] = group;
    const idsInGroup = optionsInGroup.map((o) => o.id);

    navigate({
      to: ".",
      search: (prev) => {
        const current = prev.options ?? [];
        const isSelected = current.includes(optionId);

        let next: number[];
        if (isSelected) {
          next = current.filter((id) => id !== optionId);
        } else {
          next = [
            ...current.filter((id) => !idsInGroup.includes(id)),
            optionId,
          ];
        }

        return {
          ...prev,
          options: next.length >= 1 ? Array.from(new Set(next)) : undefined,
        };
      },
      resetScroll: false,
    });
  };

  return groupedOptions.map((variation) => (
    <div key={variation[0]} className="mt-6">
      <h3 className="text-mine-shaft mb-3 text-sm font-medium">
        {variation[0]}
      </h3>
      <div className="flex flex-wrap gap-3">
        {variation[1].map((option, i) => (
          <VariantButton
            onClick={() => toggleVariationId(option.id)}
            key={option.id}
            isSelected={options.includes(option.id) ?? false}
          >
            {option.name}{" "}
            {option.priceModifier && (
              <span className="text-oyster ml-2">
                {formatPrice(option.priceModifier)}
              </span>
            )}
          </VariantButton>
        ))}
      </div>
    </div>
  ));
};

export default ProductVariations;
