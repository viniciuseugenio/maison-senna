import ProductCard from "@/components/ui/ProductCard";
import { CategoryWithProducts } from "@/types/catalog";

type ProductGridProps = {
  category: CategoryWithProducts | undefined;
};

const ProductGrid: React.FC<ProductGridProps> = ({ category }) => {
  return (
    <div className="container mx-auto mt-20 grid max-w-7xl grid-cols-3 gap-16">
      {category?.products &&
        category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showCategory={false}
          />
        ))}
    </div>
  );
};

export default ProductGrid;
