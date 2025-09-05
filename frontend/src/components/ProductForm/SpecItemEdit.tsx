import { Check, X } from "lucide-react";
import { SpecItemEditProps } from "./types";

const SpecItemEdit: React.FC<SpecItemEditProps> = ({
  inputValue,
  setInputValue,
  onSave,
  onCancel,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <div className="group relative">
      <input
        autoFocus
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.target.value)}
        className="border-oyster/30 focus:border-oyster ring-oyster/30 w-full rounded-sm border p-3 text-sm duration-300 outline-none focus:ring-3"
      />
      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 gap-2">
        <button
          onClick={onSave}
          className="cursor-pointer rounded-sm p-1.5 transition-colors duration-300 hover:bg-green-100 hover:text-green-700 focus:bg-green-100 focus:text-green-700"
          type="button"
        >
          <Check className="h-4 w-4" />
        </button>

        <button
          className="cursor-pointer rounded-sm p-1.5 transition-colors duration-300 hover:bg-red-100 hover:text-red-700 focus:bg-red-100 focus:text-red-700"
          type="button"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SpecItemEdit;
