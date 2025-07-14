import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { getProducts } from "../api/endpoints/products";
import { ProductList } from "../types/catalog";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: products } = useQuery<ProductList[]>({
    queryFn: getProducts,
    queryKey: ["products"],
  });
  const [searchResults, setSearchResults] = useState(products?.slice(0, 3));

  useEffect(() => {
    if (products) {
      setSearchResults(products.slice(0, 3));
    }
  }, [products]);

  useEffect(() => {
    if (!isOpen) {
      setHasSearched(false);
      setSearchQuery("");
    }

    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!products) return;

    const filtered = searchQuery
      ? products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : products.slice(0, 3);

    setSearchResults(filtered.slice(0, 3));
  }, [searchQuery, products]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query && !hasSearched) {
      setHasSearched(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="bg-light/95 fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
              className="container mx-auto px-4 sm:px-6 lg:px-8"
            >
              {/* Header */}
              <div className="border-mine-shaft/10 flex items-center justify-between border-b py-8">
                <h2 className="font-serif text-2xl font-light">Search</h2>
                <button
                  onClick={onClose}
                  className="hover:bg-mine-shaft/10 cursor-pointer rounded-full p-2 transition-colors"
                >
                  <X />
                </button>
              </div>

              {/* Search input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative mt-8"
              >
                <div className="pointer-events-none absolute inset-y-0 top-1/2 left-0 flex -translate-y-1/2 items-center pl-4">
                  <Search className="text-oyster/60 h-5 w-5" />
                </div>
                <input
                  ref={inputRef}
                  className="border-b-oyster/30 focus:border-b-oyster placeholder:text-mine-shaft/60 w-full border-b bg-transparent py-4 pr-4 pl-12 text-lg transition-colors outline-none"
                  placeholder="Search for products.."
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </motion.div>

              {/* Popular searches */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-6"
              >
                <h3 className="text-mine-shaft/70 text-sm font-medium tracking-wider uppercase">
                  Popular Searches
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Necklaces",
                    "Rings",
                    "Earrings",
                    "Gold",
                    "Diamond",
                    "Pearl",
                    "Gift",
                  ].map((term, index) => (
                    <motion.button
                      className="border-oyster/30 text-mine-shaft/80 hover:border-oyster hover:bg-oyster/10 active:bg-oyster/20 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors"
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.03 }}
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Search results/Featured products */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-mine-shaft/70 text-sm font-medium tracking-wider uppercase">
                    {searchQuery ? "Search Results" : "Featured Products"}
                  </h3>
                  <Link
                    className="text-oyster flex items-center text-sm hover:underline"
                    to="/"
                    onClick={onClose}
                  >
                    View all <ArrowRight className="inline-block h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults &&
                    searchResults.map((product, index) => (
                      <motion.div
                        initial={hasSearched ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        key={product.id}
                      >
                        <Link to="/" onClick={onClose} className="group">
                          <div className="bg-oyster/20 relative aspect-square overflow-hidden rounded-sm">
                            <img
                              src={product.referenceImage}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="mt-4">
                            <p className="text-oyster text-xs font-medium tracking-wider uppercase">
                              {product.category.name}
                            </p>
                            <h4 className="text-mine-shaft mt-1 font-serif text-lg font-light">
                              {product.name}
                            </h4>
                            <p className="text-mine-shaft/80 mt-1 text-sm">
                              ${product.basePrice}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
