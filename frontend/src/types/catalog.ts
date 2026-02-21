export type PaginationResults<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover: string;
};

export type ProductList = {
  category: Category;
  id: number;
  name: string;
  basePrice: string;
  referenceImage: string;
  slug: string;
};

export type CategoryWithProducts = {
  id: number;
  name: string;
  slug: string;
  cover?: string;
  description?: string;
  products?: ProductList[];
};

export type VariationOption = {
  id: number;
  name: string;
  priceModifier: string;
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
  product: {
    id: number;
    name: string;
    slug: string;
  };
  priceModifier?: string;
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
