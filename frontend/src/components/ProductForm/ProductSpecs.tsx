import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import InputError from "../InputError";
import ProductSpecItem from "./ProductSpecItem";
import { ProductSpecsProps } from "./types";
import { twMerge } from "tailwind-merge";

const ProductSpecs: React.FC<ProductSpecsProps> = ({
  name,
  value = [],
  label,
  error,
  placeholder,
}) => {
  const [specs, setSpecs] = useState<string[]>(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setValue } = useFormContext();

  useEffect(() => {
    if (value && !specs) {
      setSpecs(value);
    }
  }, [value]);

  useEffect(() => {
    setValue(name, specs, { shouldValidate: true });
  }, [specs, name, setValue]);

  const onAdd = () => {
    if (!inputRef.current) return;

    const value = inputRef.current.value.trim();
    if (!value) return;

    setSpecs((prevSpecs) => [...prevSpecs, value]);
    inputRef.current!.value = "";
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="md:col-span-3">
      <div className="text-mine-shaft mb-2 text-sm font-medium">{label}</div>
      <div className="flex gap-2">
        <input
          onKeyDown={handleEnter}
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
          {specs.map((spec, ind) => (
            <ProductSpecItem
              key={ind}
              spec={spec}
              itemIndex={ind}
              setSpecs={setSpecs}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;
