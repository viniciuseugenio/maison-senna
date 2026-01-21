import { Trash2 } from "lucide-react";
import { SpecItem, VariationOptionsObj } from "./types";
import VariationKindSelect from "./VariationKindSelect";
import VariationOptionsInput from "./VariationOptionsInput";

type VariationItemProps = {
  index: number;
  variation: VariationOptionsObj;
  canDelete: boolean;
  onUpdateKind: (index: number, value: number) => void;
  onUpdateOptions: (
    index: number,
    updater: (prev: SpecItem[]) => SpecItem[],
  ) => void;
  onDelete: (id: string) => void;
  errors: any;
};

const VariationItem: React.FC<VariationItemProps> = ({
  index,
  variation,
  canDelete,
  onUpdateKind,
  onUpdateOptions,
  onDelete,
  errors,
}) => {
  return (
    <fieldset
      key={variation.id}
      className="border-oyster/30 bg-light/30 w-full rounded-md border p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-mine-shaft text-lg font-medium">
          Variation {index + 1}
        </p>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(variation.id)}
            className="cursor-pointer rounded-md p-2 text-red-500 transition-colors duration-300 hover:bg-red-100"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <VariationKindSelect
          value={variation.variationKind}
          onChange={(value: number) => onUpdateKind(index, value)}
          error={errors?.variationKind?.message}
        />
        <VariationOptionsInput
          values={variation.options}
          setValues={(updater) => onUpdateOptions(index, updater)}
          error={errors?.options?.message}
        />
      </div>
    </fieldset>
  );
};

export default VariationItem;
