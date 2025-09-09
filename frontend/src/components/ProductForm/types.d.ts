import { VariationKind } from "../../types/catalog";

export type VariationKindSelectProps = {
  state: VariationKind | null;
  setState: (value: VariationKind) => void;
};

export type VariationOptionsInputProps = {
  index: number;
  options?: string[];
  setInputFields: React.Dispatch<React.SetStateAction<VariationOptionsObj[]>>;
};

export type VariationOptionsObj = {
  variationKind: number | null;
  options: string[];
};

export type StepInfoProps = {
  Icon: LucideIcon;
  label: string;
  description: string;
  isLast: boolean;
  onClick?: () => void;
  isCurrentStep: boolean;
  isComplete?: boolean;
};

export type BasicInfoProps = {
  getErrorMessage: (error: any) => string | undefined;
  data?: ProductDetails;
};

export type ImageInputProps = {
  name?: string;
  value?: string;
  error?: string;
};

export type SpecItem = {
  id: string;
  value: string;
};

export type ProductSpecItemProps = {
  id: string;
  index: number;
  spec: string;
  setSpecs: React.Dispatch<React.SetStateAction<SpecItem[]>>;
};

export type ProductSpecsProps = {
  name: string;
  label: string;
  placeholder: string;
  value?: string[];
  error?: string;
  className?: string;
};

export type SpecItemDisplayProps = {
  spec: string;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
};

export type SpecItemEditProps = {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export type CategoryInputProps = {
  value?: Category | null;
  error?: string | null;
};
