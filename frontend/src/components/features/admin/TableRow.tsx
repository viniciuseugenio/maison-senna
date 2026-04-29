import { twMerge } from "tailwind-merge";

const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <tr className={twMerge("hover:bg-light duration-300", className)}>
      {children}
    </tr>
  );
};

export default TableRow;
