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
