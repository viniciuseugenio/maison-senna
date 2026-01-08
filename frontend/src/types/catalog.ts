export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type VariationOption = {
  id: number;
  name: string;
  priceModifier: number;
  kind: VariationKind;
};

export type VariationKind = {
  id: number;
  name: string;
};

export type VariationOptionList = {
  id: number;
  name: string;
  kind: VariationKind;
  priceModifier?: number;
};

export type ProductList = {
  category: Category;
  id: number;
  name: string;
  basePrice: string;
  referenceImage: string;
  slug: string;
};

export type ProductDetails = {
  id: number;
  name: string;
  description: string;
  category: Category;
  referenceImage: string;
  basePrice: string;
  slug: string;
  variationOptions: VariationOption[];
  care: string[];
  materials: string[];
  details: string[];
};

export type ProductVariation = {
  id: number;
  product: string;
  sku: string;
  stock: number;
  image: string;
  options: VariationOption[];
};
