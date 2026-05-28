import { useCartActions } from "@/hooks/useCartActions";
import { ServerCartItem } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { Dot, Minus, Plus } from "lucide-react";
import { motion } from "motion/react";

interface ItemCardProps {
  index: number;
  item: ServerCartItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ index, item }) => {
  const { updateItem, deleteItem } = useCartActions(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        duration: 0.8,
        bounce: 0,
        delay: 0.3 + index * 0.1,
      }}
      className="flex w-full gap-3"
    >
      <img className="aspect-square h-32 w-32" src={item.imageUrl} />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-6">
          <span className="font-serif text-lg">{item.productName}</span>
          <span className="text-sm opacity-60">
            {formatPrice(item.unitPrice * item.quantity)}
          </span>
        </div>
        <div className="text-mine-shaft/60 mt-1 flex text-xs font-light uppercase">
          {item.options.map((option, i) => (
            <span key={`${option}-${i}`} className="inline-flex items-center">
              <span>{option}</span>
              {i < item.options.length - 1 && <Dot className="h-4 w-4" />}
            </span>
          ))}
        </div>
        <div className="mt-auto flex justify-between">
          <div className="flex w-fit items-center font-light shadow-sm">
            <button
              className="h-full cursor-pointer px-4"
              onClick={() => updateItem("decrease")}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="border-oyster/60 border-r-1 border-l-1 px-4 py-2 text-sm">
              {item.quantity}
            </span>
            <button
              className="h-full cursor-pointer px-4"
              onClick={() => updateItem("increase")}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button
            onClick={deleteItem}
            className="cursor-pointer text-xs font-light tracking-widest opacity-60 hover:text-red-600"
          >
            REMOVE
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
