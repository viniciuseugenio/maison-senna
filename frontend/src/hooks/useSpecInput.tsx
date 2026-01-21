import { SpecItem } from "@components/features/product-form/types";
import { useRef } from "react";

export const useSpecInput = (
  items: SpecItem[],
  setItems: (updater: (prev: SpecItem[]) => SpecItem[]) => void,
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isDuplicate = (value: string) => {
    return items.some(
      (item) => item.value.toLowerCase() === value.toLowerCase(),
    );
  };

  const addItem = () => {
    if (!inputRef.current) return;

    const value = inputRef.current.value.trim();
    if (!value) return;

    if (isDuplicate(value)) {
      return;
    }

    const newValue = {
      id: crypto.randomUUID(),
      value,
    };
    setItems((prev) => [...prev, newValue]);

    inputRef.current.focus();
    inputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return { inputRef, addItem, handleKeyDown };
};
