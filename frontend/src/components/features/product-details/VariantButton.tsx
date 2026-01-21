import { FunctionComponent } from "react";

type VariantButtonProps = {
  children: React.ReactNode;
  isSelected: boolean;
};

const VariantButton: FunctionComponent<VariantButtonProps> = ({
  children,
  isSelected,
}) => {
  return (
    <button className="border-mine-shaft/30 hover:border-mine-shaft/60 text-mine-shaft/80 flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-2 text-sm transition-colors duration-300">
      {children}
    </button>
  );
};

export default VariantButton;
