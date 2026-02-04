import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { twMerge } from "tailwind-merge";

const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge(className, "flex flex-col items-center")}>
      <Skeleton className="mb-6" width={608} height={760} />
      <Skeleton className="mb-3" width={186} height={20} />
      <Skeleton className="mb-6" width={130} height={36} />
      <Skeleton className="mb-6" width={156} height={40} />
    </div>
  );
};

export default CardSkeleton;
