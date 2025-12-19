import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getVariationKinds } from "../../api/endpoints/products";
import { VariationKind } from "../../types/catalog";
import SelectInput from "../SelectInput";
import { Layers } from "lucide-react";

type VariationKindSelectProps = {
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
};

const VariationKindSelect: React.FC<VariationKindSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const { data: variationKinds, isLoading } = useQuery({
    queryFn: getVariationKinds,
    queryKey: ["variationKinds"],
  });

  const selectedKind =
    !isLoading && variationKinds
      ? variationKinds.find((kind) => kind.id === value)
      : undefined;
  const kindName = selectedKind?.name;

  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (value: VariationKind) => {
    onChange(value.id);
    setIsOpen(false);
  };

  return (
    <div className="flex-1">
      <p className="text-mine-shaft mb-2 text-sm font-medium">Variation Kind</p>

      <SelectInput
        label="Select a variation kind"
        Icon={Layers}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedValue={kindName}
        error={error}
      >
        {variationKinds &&
          variationKinds.map((variationKind) => (
            <SelectInput.Option
              key={variationKind.id}
              onClick={() => handleOnChange(variationKind)}
              isSelected={false}
            >
              {variationKind.name}
            </SelectInput.Option>
          ))}
      </SelectInput>
    </div>
  );
};

export default VariationKindSelect;
