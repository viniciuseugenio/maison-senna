import { deleteWishlistItem, getWishlistItems } from "@/api/endpoints/products";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { ProductList } from "@/types/catalog";
import NavbarButton from "@components/layout/NavbarButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router";

const CardSkeleton: React.FC = () => {
  return (
    <div className="flex w-full gap-5">
      <Skeleton width={80} height={80} />

      <div className="flex flex-grow flex-col gap-1.5">
        <Skeleton width={200} height={20} />
        <Skeleton width={80} height={16} />
        <Skeleton width={75} height={19} />
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ itemId: number; product: ProductList }> = ({
  itemId,
  product,
}) => {
  const queryClient = useQueryClient();
  const { mutate: deleteItem } = useMutation({
    mutationFn: deleteWishlistItem,
    mutationKey: ["deleteWishlistItem"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return (
    <Link to={`/products/${product.slug}`} className="group flex w-full gap-5">
      {/* Product image */}
      <div className="h-20 w-20 overflow-hidden">
        <img className="h-full w-full" src={product.referenceImage} />
      </div>

      {/* Product infos */}
      <div className="flex flex-grow flex-col justify-center gap-1.5">
        <p className="text-mine-shaft font-serif text-base group-hover:underline">
          {product.name}
        </p>
        <p className="text-mine-shaft/60 text-xs">{product.category.name}</p>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-light">${product.basePrice}</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteItem(itemId);
            }}
            className="text-mine-shaft/60 cursor-pointer text-xs font-light tracking-widest uppercase duration-200 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </Link>
  );
};

const WishlistDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(isOpen, setIsOpen, dropdownRef);
  const limitQuerySet = 3;

  const { data: wishlist, isLoading } = useQuery({
    queryFn: () => getWishlistItems(limitQuerySet),
    queryKey: ["wishlist", { limit: limitQuerySet }],
    enabled: isOpen,
  });

  return (
    <div ref={dropdownRef} className="relative">
      <NavbarButton
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open wishlist dropdown"
        icon
      >
        <Heart className="h-4 w-4" />
      </NavbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-mine-shaft/20 bg-light absolute right-0 mt-3 min-w-sm border"
          >
            <div className="bg-light border-mine-shaft/20 absolute -top-1.5 right-3 h-3 w-3 rotate-45 transform border-t border-l" />
            <header className="flex items-center justify-between p-6">
              <h3 className="text-mine-shaft font-serif text-xl">
                Your Wishlist
              </h3>
              <p className="text-mine-shaft/50 text-xs tracking-widest uppercase">
                {wishlist?.length ?? 0} items
              </p>
            </header>
            {/* Divider */}
            <div className="bg-mine-shaft/20 h-[0.05rem] w-full" />
            <div className="flex flex-col gap-6 p-6">
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}

              {!isLoading &&
                wishlist &&
                wishlist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      delay: 0.2 + index * 0.15,
                    }}
                  >
                    <ProductCard itemId={item.id} product={item.product} />
                  </motion.div>
                ))}
            </div>
            {/* Divider */}
            <div className="bg-mine-shaft/20 h-[0.05rem] w-full" />
            <Link
              to="/wishlist"
              className="bg-mine-shaft text-light hover:bg-mine-shaft/90 m-3 block py-3 text-center text-sm font-medium tracking-wider uppercase duration-300"
            >
              View all wishlist
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default WishlistDropdown;
