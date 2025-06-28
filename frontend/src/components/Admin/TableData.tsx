import { twMerge } from "tailwind-merge";

const TableData: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <td
      className={twMerge(
        `text-mine-shaft px-6 py-4 text-sm whitespace-nowrap ${className ?? ""}`,
      )}
    >
      {children}
    </td>
  );
};
export default TableData;
