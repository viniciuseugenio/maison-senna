import { createFileRoute } from "@tanstack/react-router";
import { getProductVariations } from "@/api/services";
import { HeaderConfig } from "@/types";
import {
  LoadingRow,
  PageLayout,
  TableActions,
  TableData,
  TableRow,
} from "@/components/features/admin";
import { useQuery } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { PAGE_SIZE } from "@/api/constants";
import { queryKeys } from "@/api/queryKeys";

const searchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/admin/product-variations")({
  validateSearch: zodValidator(searchSchema),
  component: ProductVariations,
});

function ProductVariations() {
  const { page } = Route.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.productVariations.list({ page }),
    queryFn: () => getProductVariations({ page }),
  });

  const results = data?.results;
  const pageSize = Math.max(PAGE_SIZE, results?.length);
  const qtyPages = Math.ceil(data?.count / pageSize);

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
      qtyPages={qtyPages}
      resultsSize={results?.length}
      dataCount={data?.count}
    >
      {!data || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        results &&
        results.map((productVariation) => (
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
}

export default ProductVariations;
