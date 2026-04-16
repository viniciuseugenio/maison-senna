import { FunctionComponent } from "react";
import { twMerge } from "tailwind-merge";

type VariantButtonProps = {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
};

const VariantButton: FunctionComponent<VariantButtonProps> = ({
  children,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "border-mine-shaft/30 hover:border-mine-shaft/60 text-mine-shaft/80 flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-2 text-sm transition-colors duration-300",
        isSelected &&
          "bg-oyster/20 border-mine-shaft/60 text-mine-shaft shadow-md",
      )}
    >
      {children}
    </button>
  );
};

export default VariantButton;
