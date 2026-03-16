import { getProducts } from "@/api/services";
import {
  AdminPageLayout,
  LoadingRow,
  ProductRow,
} from "@/components/features/admin";
import { HeaderConfig } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const adminProductsOptions = queryOptions({
  queryKey: ["products"],
  queryFn: getProducts,
});

export const Route = createFileRoute("/admin/products")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(adminProductsOptions);
  },
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products, isLoading } = useQuery(adminProductsOptions);
  const results = products?.results;

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
      actionLink="new"
      onSearch={(value) => console.log(value)}
      headers={headers}
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
