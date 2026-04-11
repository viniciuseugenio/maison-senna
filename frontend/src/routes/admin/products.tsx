import { buildApiUrl } from "@/api/client";
import { CATALOG_ENDPOINTS, PAGE_SIZE } from "@/api/constants";
import { queryKeys } from "@/api/queryKeys";
import { getProducts } from "@/api/services";
import {
  AdminPageLayout,
  LoadingRow,
  TableActions,
  TableData,
  TableRow,
} from "@/components/features/admin";
import { HeaderConfig, ProductList } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().catch(1),
  q: z.string().optional(),
});

const adminProductsOptions = (page: number, q?: string, limit?: number) =>
  queryOptions({
    queryKey: queryKeys.products.list({ page, search: q, limit }),
    queryFn: () => getProducts({ page, search: q, limit }),
  });

export const Route = createFileRoute("/admin/products")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search: { page, q } }) => ({ page, q }),
  loader: ({ context: { queryClient }, deps: { page, q } }) => {
    queryClient.ensureQueryData(adminProductsOptions(page, q));
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { page, q } = Route.useSearch();

  const { data, isLoading } = useQuery(adminProductsOptions(page, q));
  const results = data?.results;
  const pageSize = Math.max(PAGE_SIZE, results?.length);
  const qtyPages = Math.ceil(data?.count / pageSize);

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "IMAGE", isButton: false },
    { title: "Name" },
    { title: "Category" },
    { title: "Price" },
    { title: "Slug" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  return (
    <AdminPageLayout
      title="Products"
      actionLabel="New Product"
      actionLink="/admin/products/new"
      onSearch={(value) => console.log(value)}
      headers={headers}
      qtyPages={qtyPages}
      resultsSize={results?.length}
      dataCount={data?.count}
    >
      {!results || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        <>
          {results.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </>
      )}
    </AdminPageLayout>
  );
}

const ProductRow: React.FC<{ product: ProductList }> = ({ product }) => {
  const deleteLink = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, {
    slug: product.slug,
  });

  return (
    <TableRow>
      <TableData>{product.id}</TableData>
      <TableData>
        <div className="h-10 w-10 overflow-hidden rounded-md">
          <img
            src={product.referenceImage}
            className="h-full w-full object-cover"
          />
        </div>
      </TableData>
      <TableData>{product.name}</TableData>
      <TableData>{product.category.name}</TableData>
      <TableData>{product.basePrice}</TableData>
      <TableData>{product.slug}</TableData>
      <TableActions
        editLink={`${product.slug}/edit`}
        deleteLink={deleteLink}
        resourceType="Product"
        queryKey={queryKeys.products.all}
      />
    </TableRow>
  );
};

export default ProductRow;
