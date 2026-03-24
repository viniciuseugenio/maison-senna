import { queryKeys } from "@/api/queryKeys";
import { getFeaturedProducts } from "@/api/services";
import { Button, HorizontalDivider, ProductCard } from "@/components/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-mine-shaft font-serif text-3xl font-light tracking-wider sm:text-4xl">
            Featured Collection
          </h2>
          <HorizontalDivider className="mx-auto mt-4" />
          <p className="text-mine-shaft/90 mt-6">
            Exquisite pieces crafted with the finest materials and unparalleled
            attention to detail.
          </p>
        </div>

        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsGrid />
        </Suspense>

        <div className="mt-16 flex items-center justify-center">
          <Link to="/collections">
            <Button variant="outline">VIEW ALL COLLECTIONS</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default FeaturedProducts;

function FeaturedProductsGrid() {
  const { data: featuredProducts } = useSuspenseQuery({
    queryFn: getFeaturedProducts,
    queryKey: queryKeys.products.featured,
  });
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {featuredProducts &&
        featuredProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center">
          <Skeleton width={345} height={345} />
          <Skeleton width={60} height={16} className="mt-6" />
          <Skeleton width={180} height={28} className="mt-2" />
          <Skeleton width={60} height={16} className="mt-2" />
        </div>
      ))}
    </div>
  );
}
