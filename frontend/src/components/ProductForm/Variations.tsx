import { Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import Button from "../Button";
import { VariationOptionsObj } from "./types";
import VariationKindSelect from "./VariationKindSelect";
import VariationOptionsInput from "./VariationOptionsInput";

const DEFAULT_VARIATION: VariationOptionsObj = {
  variationKind: null,
  options: [],
};

type VariationItemProps = {
  index: number;
  fieldId: string;
  value: VariationOptionsObj;
  canDelete: boolean;
  onDelete: () => void;
  onChangeKind: (kind: number) => void;
  onChangeOptions: (updater: React.SetStateAction<string[]>) => void;
  errors?: {
    variationKind?: { message?: string };
    options?: { message?: string };
  };
};

const VariationItem: React.FC<VariationItemProps> = ({
  index,
  fieldId,
  value,
  canDelete,
  onDelete,
  onChangeKind,
  onChangeOptions,
  errors,
}) => {
  return (
    <fieldset
      key={fieldId}
      className="border-oyster/30 bg-light/30 w-full rounded-md border p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-mine-shaft text-lg font-medium">
          Variation {index + 1}
        </p>

        <button
          type="button"
          onClick={onDelete}
          className={
            canDelete
              ? "cursor-pointer rounded-md p-2 text-red-500 transition-colors duration-300 hover:bg-red-100"
              : "invisible"
          }
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-start gap-2">
        <div className="w-full">
          <p className="text-mine-shaft mb-2 text-sm font-medium">
            Variation Kind
          </p>
          <VariationKindSelect
            value={value.variationKind}
            onChange={onChangeKind}
            error={errors?.variationKind?.message}
          />
        </div>

        <VariationOptionsInput
          values={value.options}
          setValues={onChangeOptions}
          error={errors?.options?.message}
        />
      </div>
    </fieldset>
  );
};

const Variations: React.FC = () => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const variations = watch("variations") as VariationOptionsObj[];

  const variationErrors = (errors.variations as any) || [];

  const addNewVariation = useCallback(() => {
    const newVariations = [...variations, DEFAULT_VARIATION];
    setValue("variations", newVariations);
  }, [variations, setValue]);

  const handleChangeOptions = (
    index: number,
    updater: React.SetStateAction<string[]>,
  ) => {
    const current = variations[index];
    const nextOptions =
      typeof updater === "function"
        ? (updater as (opts: string[]) => string[])(current.options as string[])
        : updater;
    const fieldName = `variations.${index}.options`;
    setValue(fieldName, nextOptions, {
      shouldValidate: true,
    });
  };

  const handleChangeKind = (index: number, kind: number) => {
    const fieldName = `variations.${index}.variationKind`;
    setValue(fieldName, kind, { shouldValidate: true });
  };

  const handleDelete = (index: number) => {
    if (variations.length <= 1) return;
    const newVariations = variations.filter((_, i) => i !== index);
    setValue("variations", newVariations, { shouldValidate: true });
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
          onClick={addNewVariation}
        >
          <Plus className="h-4 w-4" />
          Add New Variation
        </Button>
      </div>

      <div className="space-y-6">
        {variations.map((field, i) => {
          return (
            <VariationItem
              index={i}
              fieldId={field.id}
              key={field.id}
              value={field as VariationOptionsObj}
              canDelete={variations.length > 1}
              onDelete={() => handleDelete(i)}
              onChangeKind={(k) => handleChangeKind(i, k)}
              onChangeOptions={(u) => handleChangeOptions(i, u)}
              errors={variationErrors?.[i]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Variations;
