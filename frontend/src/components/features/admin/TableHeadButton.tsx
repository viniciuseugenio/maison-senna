import { ArrowDownUp } from "lucide-react";

const TableHeadButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <button className="flex cursor-pointer items-center tracking-wider gap-2">
      {children}
      <ArrowDownUp className="h-3 w-3" />
    </button>
  );
};

export default TableHeadButton;
