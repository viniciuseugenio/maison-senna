import { Plus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useSpecInput } from "../../hooks/useSpecInput";
import InputError from "../InputError";
import ProductSpecItem from "./ProductSpecItem";

type VariationOptionsInputProps = {
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  error?: string;
};

const VariationOptionsInput: React.FC<VariationOptionsInputProps> = ({
  values,
  setValues,
  error,
}) => {
  const { addItem, handleKeyDown, inputRef } = useSpecInput(values, setValues);

  return (
    <div className="w-full">
      <div className="text-mine-shaft mb-2 text-sm font-medium">Options</div>
      <div className="flex gap-2">
        <input
          onKeyDown={handleEnter}
          ref={inputRef}
          aria-invalid={!!error}
          placeholder="Add a new option"
          className={twMerge(
            "border-oyster/20 focus:border-oyster ring-oyster/30 flex-1 rounded-md border bg-white p-2 text-sm duration-300 outline-none focus:ring-2",
            error && "border-red-500 ring-red-200 focus:border-red-600",
          )}
        />
        <button
          onClick={onAdd}
          type="button"
          className="bg-oyster/80 hover:bg-oyster cursor-pointer rounded-md p-3 transition-colors duration-300"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>
      <InputError>{error}</InputError>
      <div className="mt-2">
        <div className="space-y-2">
          {values.map((value, ind) => (
            <ProductSpecItem
              key={ind}
              spec={value}
              index={ind}
              setSpecs={setValues}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariationOptionsInput;
