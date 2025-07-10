import { snakeCase } from "change-case";
import { ProductDetails } from "../../types/catalog";
import { NewProductForm } from "../../types/forms";

export function getUpdatedFields(
  original: ProductDetails,
  current: NewProductForm,
) {
  const updated: Record<string, any> = {};
  const entries = Object.entries(current) as [
    keyof NewProductForm,
    NewProductForm[keyof NewProductForm],
  ][];

  entries.forEach(([key, value]) => {
    if (key === "category") {
      if (original[key].id !== value) {
        updated[key] = value;
      }
      return;
    }

    if (["care", "details", "materials"].includes(key)) {
      if (original[key].length !== value.length) {
        updated[key] = value;
      }

      const updatedItems = value.filter(
        (value, i) => value !== original[key][i],
      );

      if (updatedItems.length >= 1) updated[key] = value;
      return;
    }

    if (original[key] !== value) {
      updated[key] = value;
    }
  });

  return updated;
}

export function partialFormData(data: Partial<NewProductForm>) {
  const formData = new FormData();
  const entries = Object.entries(data) as [
    keyof NewProductForm,
    NewProductForm[keyof NewProductForm],
  ][];

  entries.forEach(([key, value]) => {
    let parsedValue;

    if (value instanceof Array) {
      parsedValue = JSON.stringify(value);
    }

    const transformedKey = snakeCase(key);
    const newValue = parsedValue || value;

    formData.append(transformedKey, newValue);
  });

  return formData;
}
