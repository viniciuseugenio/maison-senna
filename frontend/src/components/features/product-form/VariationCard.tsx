import { getVariationKinds } from "@/api/endpoints/products";
import { NewProductForm } from "@/types/forms";
import InputError from "@components/ui/InputError";
import SelectInput from "@components/ui/SelectInput";
import { useQuery } from "@tanstack/react-query";
import { Layers, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { FieldErrors, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { FormVariatonOption, Option } from "./types";
import VariationOptionItem from "./VariationOptionItem";

type VariationCardProps = {
  index: number;
  variation: FormVariatonOption;
  canDelete: boolean;
  onUpdateKind: (index: number, value: number) => void;
  onUpdateOptions: (
    index: number,
    updater: (prev: Option[]) => Option[],
  ) => void;
  onDelete: (id: string) => void;
};

const VariationCard: React.FC<VariationCardProps> = ({
  index,
  variation,
  canDelete,
  onUpdateKind,
  onUpdateOptions,
  onDelete,
}) => {
  const { data: variationKinds } = useQuery({
    queryFn: getVariationKinds,
    queryKey: ["variationKinds"],
  });

  const [isKindOpen, setIsKindOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedKind = variationKinds?.find((k) => k.id === variation.kind);

  const {
    formState: { errors },
  } = useFormContext<NewProductForm>();

  const variationErrors = errors?.variationOptions as
    | FieldErrors<NewProductForm["variationOptions"]>
    | undefined;

  const handleKindChange = (kindId: number) => {
    onUpdateKind(index, kindId);
    setIsKindOpen(false);
  };

  const addOption = () => {
    if (!inputRef.current) return;
    const name = inputRef.current.value;
    if (!name) return;

    const isDuplicate = variation.options.some(
      (opt) => opt.name.toLowerCase() === name,
    );
    if (isDuplicate) return;

    onUpdateOptions(index, (prev) => [
      ...prev,
      { idx: crypto.randomUUID(), name },
    ]);

    inputRef.current.value = "";
    inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOption();
    }
  };

  const getKindError = (index: number) => {
    return variationErrors?.[index]?.kind?.message as string;
  };

  const getOptionError = (index: number) => {
    return variationErrors?.[index]?.options?.message;
  };

  return (
    <fieldset className="border-oyster/30 bg-light/30 w-full rounded-md border p-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-mine-shaft text-lg font-medium">
          Variation {index + 1}
        </p>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(variation.idx)}
            className="cursor-pointer rounded-md p-2 text-red-500 transition-colors duration-300 hover:bg-red-100"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-mine-shaft mb-2 text-sm font-medium">
            Variation Kind
          </label>
          <SelectInput
            label="Select a variation kind"
            selectedValue={selectedKind?.name}
            Icon={Layers}
            isOpen={isKindOpen}
            setIsOpen={setIsKindOpen}
            error={getKindError(index)}
          >
            {variationKinds &&
              variationKinds.map((variationKind) => (
                <SelectInput.Option
                  key={variationKind.id}
                  onClick={() => handleKindChange(variationKind.id)}
                  isSelected={variationKind.id === selectedKind?.id}
                >
                  {variationKind.name}
                </SelectInput.Option>
              ))}
          </SelectInput>
        </div>
        <div className="w-full flex-1">
          <label
            htmlFor="options-input"
            className="text-mine-shaft mb-2 text-sm font-medium"
          >
            Options
          </label>
          <div className="flex gap-2">
            <input
              id="options-input"
              onKeyDown={handleKeyDown}
              ref={inputRef}
              aria-invalid={!!getOptionError(index)}
              placeholder="Add a new option"
              className={twMerge(
                "border-oyster/20 focus:border-oyster ring-oyster/30 flex-1 rounded-md border bg-white p-2 text-sm duration-300 outline-none focus:ring-2",
                getOptionError(index) &&
                  "border-red-500 ring-red-200 focus:border-red-600",
              )}
            />
            <button
              onClick={addOption}
              type="button"
              className="bg-oyster/80 hover:bg-oyster cursor-pointer rounded-md p-3 transition-colors duration-300"
            >
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
          <InputError>{getOptionError(index)}</InputError>
          <div className="mt-2 space-y-2">
            {variation.options.map((option) => (
              <VariationOptionItem
                key={option.idx}
                option={option}
                index={index}
                onUpdate={onUpdateOptions}
              />
            ))}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default VariationCard;
