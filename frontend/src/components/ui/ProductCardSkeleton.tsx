import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div>
      <Skeleton width={384} height={384} />
      <div className="mt-6 text-center">
        <Skeleton width={180} height={28} />
        <Skeleton className="mt-2" width={120} height={20} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
