import { useQuery } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { getCategories } from "../../api/endpoints/products";
import { Category } from "../../types/catalog";
import SelectInput from "../SelectInput";
import { CategoryInputProps } from "./types";

const CategoryInput: React.FC<CategoryInputProps> = ({ value, error }) => {
  const { setValue, watch } = useFormContext();
  const formValue = watch("category");
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(value || null);

  const { data: categories = [] } = useQuery<Category[]>({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  const handleCategorySelect = useCallback(
    (cat: Category) => {
      setCategory(cat);
      setValue("category", cat.id, { shouldValidate: true });
    },
    [setValue],
  );

  useEffect(() => {
    if (!category && (formValue || value)) {
      const matched = categories.find((cat) => cat.id === formValue);
      if (matched) {
        handleCategorySelect(matched);
      } else if (value) {
        handleCategorySelect(value);
      }
    }
  }, [formValue, categories, value, handleCategorySelect, category]);

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
      {categories.map((cat) => (
        <SelectInput.Option
          isSelected={cat.id === category?.id}
          onKeyDown={(e) => selectOnEnter(e, cat)}
          onClick={() => selectCategory(cat)}
          key={cat.id}
        >
          {cat.name}
        </SelectInput.Option>
      ))}
    </SelectInput>
  );
};

export default CategoryInput;
