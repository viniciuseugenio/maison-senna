import { useQuery } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { getCategories } from "../../api/endpoints/products";
import { Category } from "../../types/catalog";
import SelectInput from "../SelectInput";

type CategoryInputProps = {
  value?: Category | null;
  error?: string | null;
};

const CategoryInput: React.FC<CategoryInputProps> = ({ value, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(value || null);
  const { setValue } = useFormContext();

  const { data: categories = [] } = useQuery<Category[]>({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  const handleCategorySelect = useCallback(
    (value: Category) => {
      setCategory(value);
      setValue("category", value.id, { shouldValidate: true });
    },
    [setValue],
  );

  useEffect(() => {
    if (value && !category) {
      handleCategorySelect(value);
    }
  }, [value, setValue, handleCategorySelect, category]);

  const selectCategory = (category: Category) => {
    handleCategorySelect(category);
    setIsOpen(false);
  };

  const selectOnEnter = (e: React.KeyboardEvent, category: Category) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectCategory(category);
    }
  };

  return (
    <SelectInput
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      label="Select a new category"
      Icon={Tag}
      selectedValue={category?.name}
      error={error}
    >
      {categories &&
        categories.map((cat) => (
          <li
            tabIndex={0}
            role="button"
            aria-selected={cat.id === category?.id}
            onKeyDown={(e) => selectOnEnter(e, cat)}
            onClick={() => selectCategory(cat)}
            key={cat.id}
            className={twMerge(
              `hover:bg-oyster/10 text-mine-shaft/80 hover:text-mine-shaft focus:bg-oyster/10 focus:text-mine-shaft outline-oyster cursor-pointer rounded-md p-2 transition-colors duration-300 focus-visible:outline-2`,
              `${cat.id === category?.id && "bg-oyster/10 text-mine-shaft"}`,
            )}
          >
            {cat.name}
          </li>
        ))}
    </SelectInput>
  );
};

export default CategoryInput;
