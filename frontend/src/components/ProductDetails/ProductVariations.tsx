import { VariationType } from "../../types/catalog";
import VariantButton from "./VariantButton";

const ProductVariations: React.FC<{
  variationTypes: VariationType[];
}> = ({ variationTypes }) => {
  return variationTypes.map((variant) => (
    <div key={variant.kind.id} className="mt-6">
      <h3 className="text-mine-shaft mb-3 text-sm font-medium">
        {variant.kind.name}
      </h3>
      <div className="flex flex-wrap gap-3">
        {variant.options.map((option, i) => (
          <VariantButton key={i} isSelected={false}>
            {option.name}{" "}
            {option.price_modifier && (
              <span className="text-oyster ml-2">${option.price_modifier}</span>
            )}
          </VariantButton>
        ))}
      </div>
    </div>
  ));
};

export default ProductVariations;
