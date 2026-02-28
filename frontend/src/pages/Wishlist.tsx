import { deleteWishlistItem, getWishlistItems } from "@/api/endpoints/products";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { X } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const Wishlist: React.FC = () => {
  const queryClient = useQueryClient();

  const itemsPerPage = 12;
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data: wishlist } = useQuery({
    queryFn: () => getWishlistItems({ page }),
    queryKey: ["wishlist", page],
    placeholderData: keepPreviousData,
  });

  const { mutate: mutateDeleteItem } = useMutation({
    mutationFn: (id: number) => deleteWishlistItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const qtyPages = Math.ceil(wishlist?.count / itemsPerPage);
  const results = wishlist?.results;
  const isEmpty = wishlist?.count === 0;

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

        {!isEmpty ? (
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
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default Wishlist;
