import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/endpoints/products";
import AdminPageLayout from "../../components/Admin/PageLayout";
import ProductRow from "../../components/Admin/ProductRow";
import { ProductList } from "../../types/catalog";
import { HeaderConfig } from "../../types/admin";
import LoadingRow from "../../components/Admin/LoadingRow";

const AdminProducts: React.FC = () => {
  const { data: products, isLoading } = useQuery<ProductList[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

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
      {!products || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        <>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </>
      )}
    </AdminPageLayout>
  );
};

export default AdminProducts;
