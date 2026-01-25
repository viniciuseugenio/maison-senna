import {
  deleteVariationOption,
  updateVariationOption,
} from "@/api/endpoints/products";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Option } from "./types";
import Button from "@/components/ui/Button";

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
  const [editingValue, setEditingValue] = useState({
    name: option.name,
    priceModifier: option.priceModifier,
  });

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
          option.idx === opt.idx
            ? {
                ...opt,
                name: variables.name,
                priceModifier: variables.priceModifier,
              }
            : opt,
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
    successMessage: (data) => data.detail,
    errorMessage: (error) => error.detail,
  });

  const handleSave = () => {
    if (option.id) {
      editOption({ id: option.id, ...editingValue });
    } else {
      onUpdate((prev) =>
        prev.map((opt) =>
          opt.idx === option.idx ? { ...opt, ...editingValue } : opt,
        ),
      );
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (option.id) {
      deleteOption(option.id);
    } else {
      onUpdate((prev) => prev.filter((opt) => opt.idx !== option.idx));
    }
  };

  const handleCancel = () => {
    setEditingValue({
      name: option.name,
      priceModifier: option.priceModifier,
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    const inputStyle =
      "border-oyster/60 focus:border-oyster ring-oyster/40 focus:ring-oyster/30 w-full rounded-sm border bg-white p-3 text-sm ring-1 duration-300 outline-none focus:ring-3";
    return (
      <div className="group bg-oyster/5 border-oyster/50 relative rounded-md border p-3">
        <div className="mb-3 flex gap-3">
          <div className="flex-1">
            <label
              htmlFor="option-name"
              className="text-mine-shaft mb-2 block text-sm font-medium"
            >
              Option name
            </label>
            <input
              autoFocus
              id="option-name"
              onKeyDown={handleKeyDown}
              value={editingValue.name}
              onChange={(e) =>
                setEditingValue((prev) => ({ ...prev, name: e.target.value }))
              }
              className={inputStyle}
            />
          </div>
          <div className="w-40">
            <label
              htmlFor="price-modifier"
              className="text-mine-shaft mb-2 block text-sm font-medium"
            >
              Price modifier
            </label>
            <div className="relative">
              <span className="text-mine-shaft/80 absolute top-1/2 -translate-y-1/2 px-3 text-sm">
                $
              </span>
              <input
                id="price-modifier"
                type="number"
                step={0.01}
                placeholder="Price modifier"
                value={editingValue.priceModifier}
                onChange={(e) =>
                  setEditingValue((prev) => ({
                    ...prev,
                    priceModifier: parseFloat(e.target.value) || 0,
                  }))
                }
                className={twMerge(inputStyle, "pl-7")}
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-oyster/60" />

        <div className="mt-3 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="hover:bg-oyster/30 cursor-pointer rounded-md px-4 py-2 text-sm font-medium duration-300"
          >
            Cancel
          </button>
          <Button color="brown" onClick={handleSave}>
            Save
          </Button>
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
        {option.priceModifier > 0 && (
          <span className="text-mine-shaft bg-oyster/50 rounded-full px-2 py-1 text-xs">
            +${option.priceModifier}
          </span>
        )}
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
