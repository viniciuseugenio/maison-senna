import { VariationOption } from "@/types/catalog";
import { groupOptions } from "@/utils/groupOptions";
import VariationCard from "@components/features/product-form/VariationCard";
import Button from "@components/ui/Button";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { FormVariatonOption, Option } from "./types";

interface VariationOptionsApi {
  idx: string;
  kind: number;
  options: Option[];
}

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
  const variations = watch("variationOptions") as FormVariatonOption[];
  const hasError = !!errors?.variationOptions;

  useEffect(() => {
    if (data) {
      const groupedOptions = groupOptions(data, true);
      let variationObject;
      const variationOptions: VariationOptionsApi[] = [];

      groupedOptions.map((option) => {
        const kindId = Number(option[0]);
        const options: Option[] = [];

        option[1].map((optionObject) => {
          options.push({
            idx: crypto.randomUUID(),
            id: optionObject.id,
            name: optionObject.name,
            priceModifier: parseFloat(optionObject.priceModifier) || 0,
          });
        });

        variationObject = {
          idx: crypto.randomUUID(),
          kind: kindId,
          options,
        };
        variationOptions.push(variationObject);
      });
      setValue("variationOptions", variationOptions);
    }
  }, [data, setValue]);

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
    <div
      className={twMerge(
        "border-oyster/30 rounded-md border bg-white p-6",
        hasError && "border-red-300",
      )}
    >
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
          <VariationCard
            index={index}
            key={index}
            variation={variation}
            canDelete={variations.length > 1}
            onUpdateKind={updateVariationKind}
            onUpdateOptions={updateVariationOption}
            onDelete={deleteVariation}
          />
        ))}
      </div>
    </div>
  );
};

export default Variations;
