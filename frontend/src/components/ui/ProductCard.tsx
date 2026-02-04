import { ProductList } from "@/types/catalog";
import { Link } from "react-router";

type ProductCardProps = {
  product: ProductList;
  showCategory?: boolean;
};
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showCategory = true,
}) => {
  return (
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
          {showCategory && (
            <p className="text-oyster font-sans text-sm font-medium tracking-wider uppercase">
              {product.category.name}
            </p>
          )}
          <h3 className="text-mine-shaft mt-2 font-serif text-xl font-light">
            {product.name}
          </h3>
          <p className="text-mine-shaft/90 mt-2 text-sm">
            ${product.basePrice}
          </p>
        </div>
      </Link>
    </div>
  );
};
export default ProductCard;
