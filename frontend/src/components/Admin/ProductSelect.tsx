import { useQuery } from "@tanstack/react-query";
import { ShoppingBagIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { getProducts } from "../../api/endpoints/products";
import { ProductList } from "../../types/catalog";
import SelectInput from "../SelectInput";

const ProductSelect: React.FC<{ className?: string }> = ({ className }) => {
  const { data: products } = useQuery({
    queryFn: getProducts,
    queryKey: ["products"],
  });

  const [isOpen, setIsOpen] = useState(false);
  const {
    setValue,
    formState: { errors },
  } = useFormContext();
  const error = errors?.product?.message;

  const [selectedProduct, setSelectedProduct] = useState<ProductList | null>(
    null,
  );

  const handleSelect = (option: ProductList) => {
    setSelectedProduct(option);
    setValue("product", option.id);
    setIsOpen(false);
  };

  return (
    <SelectInput
      label="Select a product..."
      selectedValue={selectedProduct?.name}
      Icon={ShoppingBagIcon}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      error={error}
      className={className}
    >
      {products &&
        products.map((product) => (
          <SelectInput.Option
            onClick={() => handleSelect(product)}
            isSelected={false}
          >
            {product.name}
          </SelectInput.Option>
        ))}
    </SelectInput>
  );
};

export default ProductSelect;
