import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductLoading: React.FC = () => {
  return (
    <>
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden">
                <Skeleton height={636} width={636} />
              </div>
            </div>
            <div className="flex-flex col">
              {/* Category */}
              <Skeleton className="mb-2" width={120} />

              {/* Title */}
              <Skeleton width={520} height={40} />

              {/* Stars and reviews */}
              <div className="mt-6 flex gap-2">
                <Skeleton width={80} />
                <Skeleton width={98} />
              </div>

              {/* Price */}
              <Skeleton className="mt-6" height={32} width={128} />

              {/* Description */}
              <div className="mt-6 leading-relaxed">
                <Skeleton count={3.5} />
              </div>

              {/* Variations */}
              <div className="mt-6">
                <Skeleton className="mb-3" width={60} />

                <div className="flex gap-3">
                  <Skeleton width={90} height={38} />
                  <Skeleton width={90} height={38} />
                  <Skeleton width={90} height={38} />
                  <Skeleton width={90} height={38} />
                </div>
              </div>

              {/* Variations */}
              <div className="mt-6">
                <Skeleton className="mb-3" width={60} />

                <div className="flex gap-3">
                  <Skeleton width={90} height={38} />
                  <Skeleton width={90} height={38} />
                  <Skeleton width={90} height={38} />
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-6">
                <Skeleton className="mb-3" width={80} />
                <Skeleton width={128} height={48} />
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Skeleton width={410} height={48} />
                <Skeleton width={140} height={48} />
                <Skeleton width={120} height={48} />
              </div>

              {/* Details tabs */}
              <div className="mt-12">
                <Skeleton className="mb-12" height={40} />
                <Skeleton width={160} className="mb-4" />
                <Skeleton width={200} className="mb-4" />
                <Skeleton width={120} className="mb-4" />
                <Skeleton width={150} className="mb-4" />
              </div>

              <div className="border-t-mine-shaft/20 mt-8 border-t pt-6 text-xs">
                <Skeleton width={100} />
                <Skeleton className="mt-1" width={120} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Reviews header */}
            <div className="mb-12 text-center">
              <Skeleton height={36} width={280} />

              <div className="mt-6 flex flex-col items-center justify-center">
                <Skeleton width={240} />
                <Skeleton className="mt-2" width={150} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <Skeleton width={896} height={136} />
              <Skeleton width={896} height={136} />
              <Skeleton width={896} height={136} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductLoading;
