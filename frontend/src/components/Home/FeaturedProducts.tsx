import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getProducts } from "../../api/endpoints/products";
import Button from "../Button";
import HorizontalDivider from "../HorizontalDivider";

export default function FeaturedProducts() {
  const { data: products } = useQuery({
    queryFn: getProducts,
    queryKey: ["products"],
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
          {products &&
            products.map((product) => (
              <div key={product.slug} className="group">
                <Link to={`/products/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.referenceImage}
                      alt={product.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-oyster font-sans text-sm font-medium tracking-wider uppercase">
                      {product.category.name}
                    </p>
                    <h3 className="text-mine-shaft mt-2 font-serif text-lg font-light">
                      {product.name}
                    </h3>
                    <p className="text-mine-shaft/90 mt-2 text-sm">
                      ${product.basePrice}
                    </p>
                  </div>
                </Link>
              </div>
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
