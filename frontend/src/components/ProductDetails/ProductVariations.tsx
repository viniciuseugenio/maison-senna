import { VariationOption } from "../../types/catalog";
import VariantButton from "./VariantButton";

const ProductVariations: React.FC<{
  variationOptions: VariationOption[];
}> = ({ variationOptions }) => {
  const groupedOptionsRecord: Record<string, VariationOption[]> =
    variationOptions.reduce(
      (acc, option) => {
        const kindName = option.kind.name;

        if (!acc[kindName]) {
          acc[kindName] = [];
        }

        acc[kindName].push(option);
        return acc;
      },
      {} as Record<string, VariationOption[]>,
    );

  const groupedOptions: [string, VariationOption[]][] =
    Object.entries(groupedOptionsRecord);

  return groupedOptions.map((variation) => (
    <div key={variation[0]} className="mt-6">
      <h3 className="text-mine-shaft mb-3 text-sm font-medium">
        {variation[0]}
      </h3>
      <div className="flex flex-wrap gap-3">
        {variation[1].map((option, i) => (
          <VariantButton key={i} isSelected={false}>
            {option.name}{" "}
            {option.priceModifier && (
              <span className="text-oyster ml-2">${option.priceModifier}</span>
            )}
          </VariantButton>
        ))}
      </div>
    </div>
  ));
};

export default ProductVariations;
