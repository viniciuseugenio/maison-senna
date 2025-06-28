import { useQuery } from "@tanstack/react-query";
import { listCategories } from "../../api/endpoints/products";
import AdminPageLayout from "../../components/Admin/PageLayout";
import ProductRow from "../../components/Admin/ProductRow";
import { Category } from "../../types/catalog";
import TableData from "../../components/Admin/TableData";
import TableActions from "../../components/Admin/RowActions";
import { HeaderConfig } from "../../types/admin";
import TableRow from "../../components/Admin/TableRow";
import LoadingRow from "../../components/Admin/LoadingRow";

const AdminCategories: React.FC = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryFn: listCategories,
    queryKey: ["categories"],
  });

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Name" },
    { title: "Slug" },
    { title: "Products" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  return (
    <AdminPageLayout
      title="Categories"
      actionLink="/"
      actionLabel="New Category"
      headers={headers}
      onSearch={(query) => console.log(query)}
    >
      {!categories || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        <>
          {categories.map((category) => (
            <TableRow>
              <TableData>{category.id}</TableData>
              <TableData>{category.name}</TableData>
              <TableData>{category.slug}</TableData>
              <TableData>12</TableData>
              <TableActions editLink="/" deleteLink="/" />
            </TableRow>
          ))}
        </>
      )}
    </AdminPageLayout>
  );
};

export default AdminCategories;
