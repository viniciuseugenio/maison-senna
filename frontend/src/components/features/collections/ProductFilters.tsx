import { ChevronDown } from "lucide-react";

const ProductFilters: React.FC = () => {
  return (
    <div className="border-mine-shaft/10 mt-24 border border-x-transparent p-4">
      <div className="text-mine-shaft container mx-auto flex max-w-7xl items-center justify-between text-xs tracking-widest uppercase">
        <div className="flex gap-8">
          <button className="flex cursor-pointer items-center justify-center gap-2 uppercase duration-300 hover:opacity-70">
            <span>Price</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <p>Material</p>
        </div>
        <div className="flex gap-3">
          <p className="text-mine-shaft/50">48 products</p>
          <p>Sort By</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
