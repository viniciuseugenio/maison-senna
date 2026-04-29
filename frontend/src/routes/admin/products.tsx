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
import EditLink from "@/components/features/admin/EditLink";
import { HeaderConfig, ProductList } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
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
  validateSearch: zodValidator(searchSchema),
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
        results.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))
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
      <TableData className="opacity-60">{product.id}</TableData>
      <TableData>
        <div className="h-16 w-16 overflow-hidden rounded-md">
          <img
            alt={product.name}
            src={product.referenceImage}
            className="h-full w-full object-cover"
          />
        </div>
      </TableData>
      <TableData className="font-serif text-lg">{product.name}</TableData>
      <TableData className="text-xs font-light tracking-wider uppercase">
        {product.category.name}
      </TableData>
      <TableData className="font-light">
        {formatPrice(product.basePrice)}
      </TableData>
      <TableData className="opacity-60">{product.slug}</TableData>
      <TableActions
        renderEditLink={() => (
          <EditLink
            to="/admin/products/$postSlug/edit"
            params={{ postSlug: product.slug }}
          />
        )}
        deleteLink={deleteLink}
        resourceType="Product"
        queryKey={queryKeys.products.all}
      />
    </TableRow>
  );
};

export default ProductRow;
