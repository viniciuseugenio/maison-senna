import { VariationOption } from "../../types/catalog";
import { groupOptions } from "../../utils/groupOptions";
import VariantButton from "./VariantButton";

const ProductVariations: React.FC<{
  variationOptions: VariationOption[];
}> = ({ variationOptions }) => {
  const groupedOptions = groupOptions(variationOptions);

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
