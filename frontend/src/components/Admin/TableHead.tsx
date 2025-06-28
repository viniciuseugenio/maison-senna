import { ArrowDownUp } from "lucide-react";
import { twMerge } from "tailwind-merge";

const TableHead: React.FC<{
  title: string;
  isButton?: boolean;
  className?: string;
}> = ({ className, title, isButton = true }) => {
  return (
    <th
      scope="col"
      className={twMerge(
        `text-mine-shaft/80 px-6 py-3 text-left text-xs font-medium ${className ?? ""}`,
      )}
    >
      {isButton ? (
        <button className="flex cursor-pointer items-center gap-2 tracking-wider">
          {title}
          <ArrowDownUp className="h-3 w-3" />
        </button>
      ) : (
        <>{title}</>
      )}
    </th>
  );
};

export default TableHead;
