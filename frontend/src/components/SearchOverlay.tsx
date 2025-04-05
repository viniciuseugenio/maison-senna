import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { products } from "../utils/mockProducts";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(products.slice(0, 3));

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-light/95 fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-mine-shaft/10 flex justify-between border-b py-8">
          <h2 className="font-serif text-2xl font-light">Search</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mt-8">
          <div className="pointer-events-none absolute inset-y-0 top-1/2 left-0 flex -translate-y-1/2 items-center pl-4">
            <Search className="text-oyster/60 h-5 w-5" />
          </div>
          <input
            className="border-b-oyster/30 focus:border-b-oyster placeholder:text-mine-shaft/60 w-full border-b bg-transparent py-4 pr-4 pl-12 text-lg transition-colors outline-none"
            placeholder="Search for products.."
            type="text"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Popular searches */}
        <div className="mt-6">
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
            ].map((term) => (
              <button
                className="border-oyster/30 text-mine-shaft/80 hover:border-oyster hover:bg-oyster/10 active:bg-oyster/20 rounded-full border px-4 py-2 text-sm transition-colors"
                key={term}
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Search results/Featured products */}
        <div className="mt-12">
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
            {searchResults.map((product) => (
              <Link key={product.id} to="/" onClick={onClose} className="group">
                <div className="bg-oyster/20 relative aspect-square overflow-hidden rounded-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-oyster text-xs font-medium tracking-wider uppercase">
                    {product.category}
                  </p>
                  <h4 className="text-mine-shaft mt-1 font-serif text-lg font-light">
                    {product.name}
                  </h4>
                  <p className="text-mine-shaft/80 mt-1 text-sm">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
