import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { retrieveProduct } from "../api/endpoints/products";
import Button from "../components/Button";
import DetailsTabs from "../components/ProductDetails/DetailsTabs";
import ProductReviews from "../components/ProductDetails/ProductReviews";
import ProductVariations from "../components/ProductDetails/ProductVariations";
import { ProductDetails } from "../types/catalog";
import ProductLoading from "./ProductLoading";

const Product: React.FC = () => {
  const MIN_QTY = 1;
  const MAX_QTY = 10;

  const [quantity, setQuantity] = useState(MIN_QTY);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      navigate("/", { replace: true });
    }
  }, [navigate, slug]);

  const handleQuantityChange = (value: number) => {
    if (value >= MIN_QTY && value <= MAX_QTY) {
      setQuantity(value);
    }
  };

  const { data: product, isPending } = useQuery<ProductDetails>({
    queryFn: () => retrieveProduct(slug as string),
    queryKey: ["products", slug],
    enabled: !!slug,
  });

  if (isPending || !product) {
    return <ProductLoading />;
  }

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
                ${product.basePrice}
              </div>
              {/* Product description */}
              <div className="text-mine-shaft/80 mt-6 text-sm leading-relaxed">
                {product.description}
              </div>
              <ProductVariations variationTypes={product.variationTypes} />
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
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-oyster/10 hover:text-mine-shaft active:bg-oyster/10 border-oyster/20 text-sm uppercase"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
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
};

export default Product;
