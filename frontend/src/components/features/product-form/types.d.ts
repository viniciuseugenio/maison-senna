export type Option = {
  idx: string;
  id?: number;
  name: string;
  priceModifier: number;
};

export type FormVariatonOption = {
  idx: string;
  kind: number;
  name: string;
  options: Option[];
  priceModifier?: number;
};

export type SpecItem = {
  idx: string;
  name: string;
};
