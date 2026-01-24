import {
  deleteVariationOption,
  updateVariationOption,
} from "@/api/endpoints/products";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { Check, Pen, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Option } from "./types";

interface VariationOptionItemProps {
  onUpdate: (updater: (prev: Option[]) => Option[]) => void;
  index: number;
  option: Option;
}

const VariationOptionItem: React.FC<VariationOptionItemProps> = ({
  onUpdate,
  index,
  option,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(option.name);
  const { mutate: editOption } = useOptimisticMutation({
    mutationFn: updateVariationOption,
    getPreviousOptions: () => {
      let previousOptions: Option[] = [];
      onUpdate((prev) => {
        previousOptions = prev;
        return prev;
      });
      return previousOptions;
    },
    onOptimisticUpdate: (variables) => {
      onUpdate((prev) =>
        prev.map((opt) =>
          option.idx === opt.idx ? { ...opt, name: variables.name } : opt,
        ),
      );
      setIsEditing(false);
    },
    onRollback: (previousOptions) => {
      onUpdate(() => previousOptions);
    },
    successMessage: (data) => data.detail,
  });

  const { mutate: deleteOption } = useOptimisticMutation({
    mutationFn: deleteVariationOption,
    onOptimisticUpdate: () => {
      onUpdate((prev) => prev.filter((opt) => opt.idx !== option.idx));
    },
    getPreviousOptions: () => {
      let previousOptions: Option[] = [];
      onUpdate((prev) => {
        previousOptions = prev;
        return prev;
      });
      return previousOptions;
    },
    onRollback: (previousOptions) => {
      onUpdate(() => previousOptions);
    },
    errorMessage: (error) => error.detail,
  });

  const handleSave = (idx: string) => {
    if (option.id) {
      editOption({ id: option.id, name: editingValue });
    } else {
      onUpdate((prev) =>
        prev.map((opt) =>
          opt.idx === idx ? { ...opt, name: editingValue } : opt,
        ),
      );
      setIsEditing(false);
    }
  };

  const handleDelete = (idx: string) => {
    if (option.id) {
      deleteOption(option.id);
    } else {
      onUpdate((prev) => prev.filter((opt) => opt.idx !== idx));
    }
  };

  const handleCancel = () => {
    setEditingValue(option.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(option.idx);
    }
  };

  if (isEditing) {
    return (
      <div className="group relative">
        <input
          autoFocus
          onKeyDown={handleKeyDown}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          className="border-oyster/60 focus:border-oyster ring-oyster/40 focus:ring-oyster/30 w-full rounded-sm border p-3 text-sm ring-1 duration-300 outline-none focus:ring-3"
        />
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 gap-2">
          <button
            onClick={() => handleSave(option.idx)}
            className="cursor-pointer rounded-sm p-1.5 transition-colors duration-300 hover:bg-green-100 hover:text-green-700 focus:bg-green-100 focus:text-green-700"
            type="button"
          >
            <Check className="h-4 w-4" />
          </button>

          <button
            className="cursor-pointer rounded-sm p-1.5 transition-colors duration-300 hover:bg-red-100 hover:text-red-700 focus:bg-red-100 focus:text-red-700"
            type="button"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      key={option.idx}
      tabIndex={0}
      className="group border-oyster/30 bg-oyster/10 hover:bg-oyster/20 flex items-center justify-between rounded-sm border p-3 transition-colors duration-300"
    >
      <div className="flex gap-2">
        <span className="bg-oyster inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white">
          {index + 1}
        </span>
        <p className="text-mine-shaft text-sm leading-relaxed">{option.name}</p>
      </div>
      <div className="invisible flex gap-2 opacity-0 transition-opacity duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="hover:bg-oyster/40 cursor-pointer rounded-sm p-1.5 opacity-40 transition-colors duration-300 hover:opacity-100"
        >
          <Pen className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="hover:bg-oyster/40 cursor-pointer rounded-sm p-1.5 opacity-40 transition-colors duration-300 hover:text-red-600 hover:opacity-100"
          onClick={() => handleDelete(option.idx)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default VariationOptionItem;
