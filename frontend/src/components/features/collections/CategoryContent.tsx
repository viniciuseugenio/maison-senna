import { CategoryWithProducts } from "@/types/catalog";
import ProductGrid from "./ProductGrid";
import EmptyState from "./EmptyState";

const CategoryHeader: React.FC = () => {
  return;
};

type CategoryContentProps = {
  category: CategoryWithProducts | undefined;
};

const CategoryContent: React.FC<CategoryContentProps> = ({ category }) => {
  const hasProducts = category?.products && category.products.length > 0;

  return (
    <>
      <header className="container mx-auto text-center">
        <h1 className="text-mine-shaft font-serif text-6xl">
          {category?.name}
        </h1>
        <p className="text-mine-shaft/60 mx-auto mt-6 max-w-4xl text-center text-lg leading-relaxed font-light tracking-tight">
          {category?.description}
        </p>
      </header>
      {hasProducts ? <ProductGrid category={category} /> : <EmptyState />}
    </>
  );
};

export default CategoryContent;
