import { SpecItem } from "@components/features/product-form/types";
import { NewProductForm } from "@/types/forms";

type VariationsObj = {
  idx: string;
  kind: number;
  options: SpecItem[];
};

function formatVariations(variations: VariationsObj[]) {
  const newVariations = variations.map((variation) => ({
    kind: variation.kind,
    options: variation.options.map((option) => ({
      name: option.name,
    })),
  }));
  return newVariations;
}

export function convertToFormData(data: NewProductForm): FormData {
  const formData = new FormData();
  formData.set("name", data.name);
  formData.set("basePrice", String(data.basePrice));
  formData.set("referenceImage", data.referenceImage);
  formData.set("description", data.description);
  formData.set("category", String(data.category));
  formData.set("details", JSON.stringify(data.details));
  formData.set("materials", JSON.stringify(data.materials));
  formData.set("care", JSON.stringify(data.care));
  formData.set(
    "variationOptions",
    JSON.stringify(formatVariations(data.variationOptions)),
  );
  return formData;
}
