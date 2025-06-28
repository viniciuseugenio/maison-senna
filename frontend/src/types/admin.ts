import { LucideProps } from "lucide-react";

export type Statistics = {
  totalCustomers: number;
  products: number;
  categories: number;
  variationKinds: number;
  variationOptions: number;
  variationTypes: number;
  productVariations: number;
};

export type HeaderConfig = {
  title: string;
  isButton?: boolean;
  className?: string;
  onClick?: () => void;
};

export type PageLayoutProps = {
  title: string;
  actionLabel: string;
  actionLink: string;
  onSearch: (query: string) => void;
  headers: HeaderConfig[];
  children: React.ReactNode;
};

export type BigBoxProps = {
  to: string;
  title: string;
  Icon: React.FC<LucideProps>;
  description: string;
  data?: string | number;
};

export type SectionHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export type SmallBoxProps = {
  Icon: React.FC<LucideProps>;
  title: string;
  data?: string | number;
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
