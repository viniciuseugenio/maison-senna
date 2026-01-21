import { getVariationKinds } from "@/api/endpoints/products";
import { VariationKind } from "@/types/catalog";
import SelectInput from "@components/ui/SelectInput";
import { useQuery } from "@tanstack/react-query";
import { Layers } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const VariationKindSelect: React.FC = () => {
  const { data: variationKinds } = useQuery({
    queryFn: getVariationKinds,
    queryKey: ["variationKinds"],
  });

  const [isOpen, setIsOpen] = useState(false);
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors?.kind?.message;
  console.log("variationkindselect", error);

  const [selectedVariationKind, setSelectedVariationKind] =
    useState<VariationKind | null>(null);

  const handleSelect = (option: VariationKind) => {
    setSelectedVariationKind(option);
    setValue("kind", option.id);
    setIsOpen(false);
  };

  return (
    <SelectInput
      label="Select a variation kind"
      selectedValue={selectedVariationKind?.name}
      Icon={Layers}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      error={error}
    >
      {variationKinds &&
        variationKinds.map((variationKind) => (
          <SelectInput.Option
            key={variationKind.id}
            onClick={() => handleSelect(variationKind)}
            isSelected={variationKind.id === selectedVariationKind?.id}
          >
            {variationKind.name}
          </SelectInput.Option>
        ))}
    </SelectInput>
  );
};

export default VariationKindSelect;
