import Button from "@components/ui/Button";
import { ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

const ShoppingCart: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

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
              className="fixed inset-y-0 right-0 max-w-md bg-white"
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
                    Shopping Bag (0)
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
                  className="flex-1 overflow-y-auto py-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <div className="flex h-full flex-col items-center justify-center px-6 py-12">
                    <ShoppingBag className="h-12 w-12 text-[#e5e2dc]" />
                    <h3 className="text-mine-shaft mt-4 font-serif text-lg">
                      Your shopping bag is empty
                    </h3>
                    <p className="text-mine-shaft/80 mt-2 text-center text-sm">
                      Discover our collections and add something special to your
                      bag.
                    </p>
                    <Button className="mt-6 uppercase" onClick={onClose}>
                      Continue Shopping
                    </Button>
                  </div>
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
