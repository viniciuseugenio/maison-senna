export type Category = {
  id: number;
  name: string;
  slug: string;
};

type VariationOption = {
  id: number;
  name: string;
  price_modifier: string;
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
  variationTypes: VariationType[];
  care: string[];
  materials: string[];
  details: string[];
};
