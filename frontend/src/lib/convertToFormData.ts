import { SpecItem } from "@components/features/product-form/types";
import { NewProductForm } from "@/types/forms";

type VariationsObj = {
  id: string;
  variationKind: number;
  options: SpecItem[];
};

function formatVariations(variations: VariationsObj[]) {
  const newVariations = variations.map((variation) => ({
    variationKind: variation.variationKind,
    options: variation.options.map((option) => option.value),
  }));
  return newVariations;
}

export function convertToFormData(data: NewProductForm): FormData {
  const formData = new FormData();
  formData.set("name", data.name);
  formData.set("base_price", String(data.basePrice));
  formData.set("reference_image", data.referenceImage);
  formData.set("description", data.description);
  formData.set("category", String(data.category));
  formData.set("details", JSON.stringify(data.details));
  formData.set("materials", JSON.stringify(data.materials));
  formData.set("care", JSON.stringify(data.care));
  formData.set("variations", JSON.stringify(formatVariations(data.variations)));
  return formData;
}
