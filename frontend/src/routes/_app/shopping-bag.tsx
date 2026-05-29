import { queryKeys } from "@/api/queryKeys";
import { getUserCart } from "@/api/services/cart.service";
import PageItemCard from "@/components/features/cart/PageItemCard";
import { Button, HorizontalDivider } from "@/components/ui";
import { formatPrice } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/shopping-bag")({
  component: ShoppingBag,
});

function ShoppingBag() {
  const { data: cart } = useQuery({
    queryFn: getUserCart,
    queryKey: queryKeys.cart,
  });
  const totalQty =
    cart?.items?.reduce((acc, item) => item.quantity + acc, 0) ?? 0;

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto flex justify-between gap-24 px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div>
            <h1 className="title text-4xl">Shopping Bag</h1>
            <p className="text-mine-shaft/60 mt-2 italic">
              {totalQty} {totalQty > 1 ? "items" : "item"} in your curation
            </p>
          </div>
          <div className="mt-12 flex w-full flex-col gap-20">
            {cart?.items.map((item) => (
              <PageItemCard key={item.variationSku} item={item} />
            ))}
          </div>
        </div>
        <div className="bg-oyster/5 h-fit min-w-sm p-6 text-lg">
          <h2 className="title text-xl">Order Summary</h2>
          <div className="text-mine-shaft/80 mt-10 flex flex-col gap-3 text-sm font-light">
            <div className="flex items-center justify-between">
              <p>Subtotal</p>
              <p>{formatPrice(cart?.subtotal)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Shipping</p>
              <p className="italic">Calculated at checkout</p>
            </div>
          </div>
          <HorizontalDivider className="bg-oyster/30 my-6 w-full" />
          <div className="text-mine-shaft flex justify-between">
            <p>Total</p>
            <p className="font-medium">{formatPrice(cart?.subtotal)}</p>
          </div>
          <Button
            as={Link}
            to="/checkout"
            color="brown"
            className="mt-12 w-full py-7"
          >
            Proceed to Checkout
          </Button>
          <Link
            to="/"
            className="border-oyster/10 hover:bg-oyster/20 active:bg-oyster/30 text-mine-shaft mt-3 block border-2 py-4 text-center text-sm font-light tracking-wider uppercase duration-300"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
