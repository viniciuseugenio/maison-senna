import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CollectionSkeleton: React.FC = () => {
  return (
    <>
      <header className="mx-auto text-center">
        <Skeleton height={60} width={300} />
        <Skeleton className="mt-8" height={20} width={890} />
        <Skeleton height={20} width={600} />
      </header>
      <div className="border-mine-shaft/10 mt-24 border border-x-transparent p-4">
        <div className="text-mine-shaft container mx-auto flex max-w-7xl items-center justify-between text-xs tracking-widest uppercase">
          <div className="flex gap-3">
            <p>Price</p>
            <p>Material</p>
          </div>
          <div className="flex gap-3">
            <p className="text-mine-shaft/50">48 products</p>
            <p>Sort By</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-20 grid max-w-7xl grid-cols-3 gap-16">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </>
  );
};

export default CollectionSkeleton;
