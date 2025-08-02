export type ImageInputProps = {
  name?: string;
  value?: string;
  error?: string;
};

export type ProductSpecItemProps = {
  itemIndex: number;
  spec: string;
  setSpecs: React.Dispatch<React.SetStateAction<string[]>>;
};

export type ProductSpecsProps = {
  name: string;
  label: string;
  placeholder: string;
  value?: string[];
  error?: string;
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
