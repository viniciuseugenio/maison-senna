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

export type VariationType = {
  id: number;
  kind: VariationKind;
  options: VariationOption[];
};

export type VariationTypeList = {
  id: number;
  kind: string;
  product: string;
};

export type VariationOptionList = {
  id: number;
  type: VariationTypeList;
  name: string;
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
