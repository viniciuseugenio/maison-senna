import { getProducts } from "@/api/endpoints/products";
import { HeaderConfig } from "@/types/admin";
import LoadingRow from "@components/features/admin/LoadingRow";
import AdminPageLayout from "@components/features/admin/PageLayout";
import ProductRow from "@components/features/admin/ProductRow";
import { useQuery } from "@tanstack/react-query";

const AdminProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
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
};

export default AdminProducts;
