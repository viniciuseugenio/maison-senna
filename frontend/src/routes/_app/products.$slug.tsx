import { queryKeys } from "@/api/queryKeys";
import { getProduct } from "@/api/services";
import {
  DetailsTabs,
  ProductReviews,
  ProductVariations,
  WishlistButton,
} from "@/components/features/product-details";
import { Button } from "@/components/ui";
import { formatPrice } from "@/utils/formatPrice";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Share2, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const productQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => getProduct(slug),
  });

export const Route = createFileRoute("/_app/products/$slug")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(productQueryOptions(params.slug));
  },
  component: Product,
  pendingComponent: ProductLoading,
});

function Product() {
  const MIN_QTY = 1;
  const MAX_QTY = 10;

  const [quantity, setQuantity] = useState(MIN_QTY);
  const { slug } = Route.useParams();

  const { data: product } = useSuspenseQuery(productQueryOptions(slug));

  const handleQuantityChange = (value: number) => {
    if (value >= MIN_QTY && value <= MAX_QTY) {
      setQuantity(value);
    }
  };

  return (
    <>
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden">
                <img src={product.referenceImage} alt={product.name} />
              </div>
            </div>
            <div className="flex flex-col">
              {/* Product category */}
              <div className="text-oyster mb-2 text-sm font-medium tracking-wider uppercase">
                {product.category.name}
              </div>
              <h1 className="text-mine-shaft font-serif text-4xl font-light">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-oyster text-oyster h-4 w-4" />
                  ))}
                </div>
                <span className="text-mine-shaft/80 ml-2 text-sm">
                  5.0 (2 reviews)
                </span>
              </div>
              <div className="text-mine-shaft mt-6 text-2xl font-light">
                {formatPrice(product.basePrice)}
              </div>
              {/* Product description */}
              <div className="text-mine-shaft/80 mt-6 text-sm leading-relaxed">
                {product.description}
              </div>
              <ProductVariations variationOptions={product.variationOptions} />
              <div className="mt-6">
                <h3 className="text-mine-shaft mb-3 text-sm font-medium">
                  Quantity
                </h3>
                <div className="flex h-12 w-32">
                  <button
                    className="border-oyster/30 text-mine-shaft hover:bg-oyster/10 flex h-full w-12 cursor-pointer items-center justify-center border border-r-0 bg-white transition-colors duration-300"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= MIN_QTY}
                  >
                    -
                  </button>
                  <span className="border-oyster/30 text-mine-shaft flex h-full w-12 items-center justify-center border bg-white">
                    {quantity}
                  </span>
                  <button
                    className="border-l-none border-oyster/30 hover:bg-oyster/10 h-full w-12 cursor-pointer items-center justify-center border bg-white transition-colors duration-300"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= MAX_QTY}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="flex-1 text-sm uppercase">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <WishlistButton
                  productSlug={product.slug}
                  productId={product.id}
                  isWishlisted={product.isWishlisted}
                />
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-oyster/10 hover:text-mine-shaft active:bg-oyster/10 border-oyster/20 text-sm uppercase"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              <div className="mt-12">
                <DetailsTabs
                  details={product.details}
                  care={product.care}
                  materials={product.materials}
                />
              </div>
              <div className="border-t-mine-shaft/20 text-mine-shaft/60 mt-8 border-t pt-6 text-xs">
                <p>SKU: CP-001-YG</p>
                <p className="mt-1">
                  Availability: <span className="text-green-600">In Stock</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <ProductReviews />
          </div>
        </div>
      </section>
    </>
  );
}

function ProductLoading() {
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
}
