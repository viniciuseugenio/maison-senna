export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type ProductList = {
  category: Category;
  id: number;
  name: string;
  basePrice: string;
  referenceImage: string;
  slug: string;
};
