import { useSpecInput } from "@/hooks/useSpecInput";
import InputError from "@components/ui/InputError";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import ProductSpecItem from "./ProductSpecItem";
import { ProductSpecsProps, SpecItem } from "./types";

const ProductSpecs: React.FC<ProductSpecsProps> = ({
  name,
  value,
  label,
  error,
  placeholder,
  className,
}) => {
  const { setValue, watch } = useFormContext();
  const formSpecs = watch(name) || value || [];
  const [specs, setSpecs] = useState<SpecItem[]>(
    formSpecs.map((spec) => ({ id: crypto.randomUUID(), value: spec })),
  );
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const onlyNames = specs.map((spec) => spec.value);
    setValue(name, onlyNames, { shouldValidate: touched });
  }, [name, setValue, specs, touched]);

  const { inputRef, addItem, handleKeyDown } = useSpecInput(
    specs,
    (updater) => {
      setSpecs(updater);
      if (!touched) setTouched(true);
    },
  );

  return (
    <div className={twMerge("md:col-span-3", className)}>
      <div className="text-mine-shaft mb-2 text-sm font-medium">{label}</div>
      <div className="flex gap-2">
        <input
          onKeyDown={handleKeyDown}
          ref={inputRef}
          id={name}
          aria-invalid={!!error}
          placeholder={placeholder}
          className={twMerge(
            "border-oyster/20 focus:border-oyster ring-oyster/30 flex-1 rounded-md border bg-white p-2 text-sm duration-300 outline-none focus:ring-2",
            error && "border-red-500 ring-red-300 focus:border-red-600",
          )}
        />
        <button
          onClick={addItem}
          type="button"
          className="bg-oyster/80 hover:bg-oyster cursor-pointer rounded-md p-3 transition-colors duration-300"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>
      <InputError>{error}</InputError>
      <div className="mt-2">
        <div className="space-y-2">
          {specs.map((spec, ind) => (
            <ProductSpecItem
              key={spec.id}
              spec={spec.value}
              index={ind}
              id={spec.id}
              setSpecs={setSpecs}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;
