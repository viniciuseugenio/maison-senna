import { getFeaturedProducts } from "@/api/endpoints/products";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@components/ui/Button";
import HorizontalDivider from "@components/ui/HorizontalDivider";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

export default function FeaturedProducts() {
  const { data: featuredProducts } = useQuery({
    queryFn: getFeaturedProducts,
    queryKey: ["featuredProducts"],
  });

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-mine-shaft font-serif text-3xl font-light tracking-wider sm:text-4xl">
            Featured Collection
          </h2>
          <HorizontalDivider className="mx-auto" />
          <p className="text-mine-shaft/90 mt-6">
            Exquisite pieces crafted with the finest materials and unparalleled
            attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts &&
            featuredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
        </div>

        <div className="mt-16 flex items-center justify-center">
          <Link to="/collections">
            <Button variant="outline">VIEW ALL COLLECTIONS</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
