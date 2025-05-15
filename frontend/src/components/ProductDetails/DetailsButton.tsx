import { FunctionComponent } from "react";

type DetailsButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const DetailsButton: FunctionComponent<DetailsButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-mine-shaft/70 hover:text-mine-shaft z-10 cursor-pointer text-sm font-medium uppercase transition-colors duration-300"
    >
      {label}
    </button>
  );
};

export default DetailsButton;
