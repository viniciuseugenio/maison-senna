import { Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import Button from "@components/ui/Button";
import { SpecItem, VariationOptionsObj } from "./types";
import VariationItem from "./VariationItem";

const Variations: React.FC = () => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const variations = watch("variations") as VariationOptionsObj[];

  const addVariation = () => {
    const newVariation = {
      id: crypto.randomUUID(),
      variationKind: 0,
      options: [],
    };

    setValue("variations", [...variations, newVariation]);
  };

  const deleteVariation = (id: string) => {
    setValue(
      "variations",
      variations.filter((obj) => obj.id !== id),
    );
  };

  const updateVariationKind = async (index: number, value: number) => {
    setValue(`variations.${index}.variationKind`, value);
    await trigger(`variations.${index}.variationKind`);
  };

  const updateVariationOption = (
    index: number,
    updater: (prev: SpecItem[]) => SpecItem[],
  ) => {
    const newValues = updater(variations[index].options);
    setValue(`variations.${index}.options`, newValues);
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
