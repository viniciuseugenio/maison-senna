import { queryKeys } from "@/api/queryKeys";
import { deleteWishlistItem, getWishlistItems } from "@/api/services";
import { Button, Pagination } from "@/components/ui";
import { requiredAuthenticated } from "@/lib/route-guards";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { z } from "zod";

const productSearchSchema = z.object({
  page: z.number().catch(1),
});

const wishlistQueryOptions = (page: number) =>
  queryOptions({
    queryKey: queryKeys.wishlist.paginated(page),
    queryFn: () => getWishlistItems({ page }),
    placeholderData: keepPreviousData,
  });

export const Route = createFileRoute("/_app/wishlist")({
  beforeLoad: requiredAuthenticated,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ context: { queryClient }, deps: { page } }) => {
    queryClient.ensureQueryData(wishlistQueryOptions(page));
  },
  component: Wishlist,
  validateSearch: productSearchSchema,
});

function Wishlist() {
  return (
    <section className="from-oyster/10 bg-linear-180 to-transparent">
      <div className="container mx-auto py-16">
        <div className="text-center">
          <h1 className="title text-6xl">Your Private Collection</h1>
          <p className="text-mine-shaft/80 mx-auto mt-4 max-w-3xl leading-6 font-light">
            Curated pieces awaiting to be yours. Each item reflects a commitment
            to timeless elegance and superior craftsmanship.
          </p>
        </div>

        <Suspense fallback={<CardLoading />}>
          <WishlistItems />
        </Suspense>
      </div>
    </section>
  );
}

const WishlistItems: React.FC = () => {
  const queryClient = useQueryClient();

  const itemsPerPage = 12;
  const { page } = Route.useSearch();
  const { data: wishlist } = useSuspenseQuery(wishlistQueryOptions(page));

  const { mutate: mutateDeleteItem } = useMutation({
    mutationFn: (id: number) => deleteWishlistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });

  const qtyPages = Math.ceil(wishlist?.count / itemsPerPage);
  const results = wishlist?.results;
  const isEmpty = wishlist?.count === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto mt-20 text-center">
        <h3 className="title text-3xl">
          Your curated selection is currently a blank canvas.
        </h3>
        <p className="text-mine-shaft/60 mx-auto mt-3 max-w-xl">
          Gather pieces that speak to your unique aesthetic and begin your
          journey into timeless elegance.
        </p>
        <Button
          as={Link}
          to="/collections"
          variant="outline"
          className="mx-auto mt-12 w-fit px-12 py-6 font-light tracking-widest uppercase"
        >
          View all collections
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-16 grid grid-cols-3 gap-12">
        {results &&
          results.map(({ id, product }) => (
            <div className="group bg-white p-4 shadow-md duration-300 hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.referenceImage}
                  className="h-full w-full object-cover duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => mutateDeleteItem(id)}
                  className="text-light invisible absolute top-3 right-3 cursor-pointer rounded-full bg-black/30 p-2 group-hover:visible"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <Link key={product.id} to={`/products/${product.slug}`}>
                  <p className="title text-lg font-medium hover:underline">
                    {product.name}
                  </p>
                </Link>
                <p className="text-mine-shaft/60 mt-2 font-light">
                  ${product.basePrice}
                </p>
                <Button
                  className="mt-3 w-full tracking-widest"
                  variant="outline"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
      </div>
      <Pagination qtyPages={qtyPages} windowSize={7}></Pagination>
    </>
  );
};

const CardLoading: React.FC = () => {
  return (
    <div className="mt-16 grid grid-cols-3 gap-12">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="group bg-white p-4 shadow-md duration-300 hover:shadow-lg"
        >
          <Skeleton width={448} height={448} />
          <div className="mt-4 text-center">
            <Skeleton width={228} height={25} />
            <Skeleton className="mt-4" width={80} height={20} />
            <Skeleton className="mt-4" width={448} height={48} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
