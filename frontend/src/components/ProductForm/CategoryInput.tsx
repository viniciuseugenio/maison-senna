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
          <SelectInput.Option key={cat.id} isSelected={cat.id === category?.id}>
            {cat.name}
          </SelectInput.Option>
        ))}
    </SelectInput>
  );
};

export default CategoryInput;
