import { useQuery } from "@tanstack/react-query";
import { getProductVariations } from "../../api/endpoints/products";
import LoadingRow from "../../components/Admin/LoadingRow";
import PageLayout from "../../components/Admin/PageLayout";
import TableActions from "../../components/Admin/RowActions";
import TableData from "../../components/Admin/TableData";
import TableRow from "../../components/Admin/TableRow";
import { HeaderConfig } from "../../types/admin";

const ProductVariations: React.FC = () => {
  const { data: productVariations, isLoading } = useQuery({
    queryKey: ["productVariations"],
    queryFn: getProductVariations,
  });

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "IMAGE", isButton: false },
    { title: "SKU" },
    { title: "Product" },
    { title: "OPTIONS", isButton: false },
    { title: "Stock" },
    { title: "ACTIONS", isButton: false, className: "text-right" },
  ];

  return (
    <PageLayout
      title="Product Variations"
      headers={headers}
      actionLabel="New Product Variation"
      actionLink="/"
    >
      {!productVariations || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        productVariations.map((productVariation) => (
          <TableRow>
            <TableData>{productVariation.id}</TableData>
            <TableData>{productVariation.image}</TableData>
            <TableData>{productVariation.sku}</TableData>
            <TableData>{productVariation.product}</TableData>
            <TableData>
              <div className="flex gap-2">
                {productVariation.options.map((option) => (
                  <p className="bg-oyster/15 rounded-full px-2 py-1 text-xs">
                    {option.name}
                  </p>
                ))}
              </div>
            </TableData>

            <TableData>{productVariation.stock}</TableData>
            <TableActions
              editLink="/"
              deleteLink="/"
              resourceType="Product Variation"
              queryKey={["productVariations"]}
            />
          </TableRow>
        ))
      )}
    </PageLayout>
  );
};

export default ProductVariations;
