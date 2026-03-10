export type Option = {
  idx: string;
  id?: number;
  name: string;
  priceModifier: number;
};

export type FormVariationOption = {
  idx: string;
  kind: number;
  options: Option[];
  priceModifier?: number;
};

export type SpecItem = {
  idx: string;
  name: string;
};
