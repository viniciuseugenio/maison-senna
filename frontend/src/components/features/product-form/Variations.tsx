import { VariationOption } from "@/types/catalog";
import { Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import Button from "@components/ui/Button";
import { SpecItem, VariationOptionsObj } from "./types";
import VariationItem from "./VariationItem";
import { FormVariatonOption, Option } from "./types";

interface VariationsProps {
  data?: VariationOption[];
}

const Variations: React.FC<VariationsProps> = ({ data }) => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const error = errors.variationOptions?.message;
  const variations = watch("variationOptions") as FormVariatonOption[];

  const addVariation = () => {
    const newVariation = {
      idx: crypto.randomUUID(),
      kind: 0,
      options: [],
    };

    setValue("variationOptions", [...(variations || []), newVariation]);
  };

  const deleteVariation = (idx: string) => {
    setValue(
      "variationOptions",
      variations.filter((obj) => obj.idx !== idx),
    );
  };

  const updateVariationKind = async (index: number, value: number) => {
    setValue(`variationOptions.${index}.kind`, value);
    await trigger(`variationOptions.${index}.kind`);
  };

  const updateVariationOption = (
    index: number,
    updater: (prev: Option[]) => Option[],
  ) => {
    const newValues = updater(variations[index].options);
    setValue(`variationOptions.${index}.options`, newValues);
  };

  return (
    <div className="border-oyster/30 rounded-md border bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-mine-shaft font-serif text-xl font-light">
          Product Variations
        </h2>
        <Button
          color="brown"
          type="button"
          className="gap-2 rounded-md shadow-md"
          onClick={addVariation}
        >
          <Plus className="h-4 w-4" />
          Add New Variation
        </Button>
      </div>

      <div className="space-y-6">
        {variations?.map((variation, index) => (
          <VariationItem
            key={index}
            index={index}
            variation={variation}
            canDelete={variations.length > 1}
            onUpdateKind={updateVariationKind}
            onUpdateOptions={updateVariationOption}
            onDelete={deleteVariation}
            errors={errors?.variations?.[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default Variations;
