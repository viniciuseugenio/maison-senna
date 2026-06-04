import { queryKeys } from "@/api/queryKeys";
import { getUserCart } from "@/api/services/cart.service";
import { Button, HorizontalDivider } from "@/components/ui";
import { useIsAuthenticated } from "@/hooks/auth";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { formatPrice } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import ItemCard from "./ItemCard";

const ShoppingCart: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useIsAuthenticated();

  const { data: cart } = useQuery({
    queryFn: getUserCart,
    queryKey: queryKeys.cart,
    enabled: isOpen || isAuthenticated,
  });

  const itemsQty =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  useOutsideClick(isOpen, onClose, cartRef);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 w-full bg-black/30 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              bounce: 0,
              ease: "easeInOut",
              duration: 0.5,
            }}
          >
            <motion.div
              ref={cartRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white"
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0,
                ease: "easeInOut",
              }}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b-mine-shaft/20 flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-mine-shaft font-serif text-xl font-light">
                    Shopping Bag ({itemsQty})
                  </h2>
                  <button
                    onClick={onClose}
                    aria-label="Close cart"
                    className="text-mine-shaft/80 hover:bg-mine-shaft/5 cursor-pointer rounded-full p-2 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <motion.div
                  className="flex flex-1 flex-col gap-10 overflow-y-auto px-6 py-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  {itemsQty <= 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-[#e5e2dc]" />
                      <h3 className="text-mine-shaft mt-4 font-serif text-lg">
                        Your shopping bag is empty
                      </h3>
                      <p className="text-mine-shaft/80 mt-2 text-center text-sm">
                        Discover our collections and add something special to
                        your bag.
                      </p>
                      <Button className="mt-6 uppercase" onClick={onClose}>
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col">
                      <div className="flex flex-col gap-6">
                        {cart &&
                          cart.items.map((item, index) => (
                            <ItemCard
                              item={item}
                              key={item.variationSku}
                              index={index}
                            />
                          ))}
                      </div>
                      <div className="mt-auto">
                        <HorizontalDivider className="bg-oyster/40 mx-auto w-full" />
                        <div className="mt-6 flex items-center justify-between font-light">
                          <p className="text-mine-shaft/80 text-xs tracking-[0.15em] uppercase">
                            Subtotal
                          </p>
                          <p className="text-lg">
                            {formatPrice(cart?.subtotal)}
                          </p>
                        </div>
                        <p className="text-mine-shaft/50 mt-2 w-full text-right text-xs">
                          Shopping calculated at checkout
                        </p>
                        <div className="mt-6 flex flex-col gap-2">
                          <Button
                            onClick={() => {
                              navigate({ to: "/checkout" });
                              onClose();
                            }}
                            className="w-full py-7 text-sm font-light tracking-widest"
                          >
                            Proceed to Checkout
                          </Button>
                          <Button
                            onClick={() => {
                              navigate({ to: "/shopping-bag" });
                              onClose();
                            }}
                            className="text-mine-shaft active:bg-oyster/50 hover:bg-oyster/30 w-full bg-transparent text-sm font-light tracking-widest outline-none"
                          >
                            View Full Bag
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShoppingCart;
