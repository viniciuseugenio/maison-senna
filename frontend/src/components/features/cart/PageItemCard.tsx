import { useCartActions } from "@/hooks/useCartActions";
import { ServerCartItem } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Dot, Minus, Plus, X } from "lucide-react";

const PageItemCard: React.FC<{ item: ServerCartItem }> = ({ item }) => {
  const { deleteItem, updateItem } = useCartActions(item);

  return (
    <div className="flex gap-8">
      {/* Image side */}
      <div className="aspect-square w-64">
        <img className="h-full w-full" src={item.imageUrl} />
      </div>

      {/* Info side */}
      <div className="flex w-full flex-col">
        <div className="h-fit w-full">
          {/* Product Header */}
          <div className="flex items-center justify-between">
            <p className="title text-2xl">{item.productName}</p>
            <span className="text-mine-shaft text-sm font-light">
              {formatPrice(item.unitPrice * item.quantity)}
            </span>
          </div>

          {/* Options */}
          <div className="text-mine-shaft/70 text-sm font-light">
            {item.options.map((option, i) => (
              <span className="inline-flex">
                <span>{option}</span>
                {i < item.options.length - 1 && <Dot />}
              </span>
            ))}
          </div>
        </div>

        {/* Footer action links */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-6 font-light">
            <button
              onClick={() => updateItem("decrease")}
              className="cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateItem("increase")}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={deleteItem}
            className="text-mine-shaft/60 flex cursor-pointer items-center gap-1 text-xs tracking-widest uppercase duration-300 hover:text-red-600"
          >
            <span>
              <X className="h-4 w-4" />
            </span>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageItemCard;
