import { ProductCard } from "@/components/ui";
import { CategoryWithProducts } from "@/types";

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
