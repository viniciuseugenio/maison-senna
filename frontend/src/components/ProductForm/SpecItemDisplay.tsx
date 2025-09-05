import { Pen, Trash2 } from "lucide-react";
import { SpecItemDisplayProps } from "./types";

const SpecItemDisplay: React.FC<SpecItemDisplayProps> = ({
  spec,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      tabIndex={0}
      className="group border-oyster/30 bg-oyster/10 hover:bg-oyster/20 flex items-center justify-between rounded-sm border p-3 transition-colors duration-300"
    >
      <div className="flex gap-2">
        <span className="bg-oyster inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white">
          {index + 1}
        </span>
        <p className="text-mine-shaft text-sm leading-relaxed">{spec}</p>
      </div>
      <div className="invisible flex gap-2 opacity-0 transition-opacity duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="hover:bg-oyster/40 cursor-pointer rounded-sm p-1.5 opacity-40 transition-colors duration-300 hover:opacity-100"
        >
          <Pen className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="hover:bg-oyster/40 cursor-pointer rounded-sm p-1.5 opacity-40 transition-colors duration-300 hover:text-red-600 hover:opacity-100"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SpecItemDisplay;
