import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useLocation } from "react-router";
import { buildApiUrl } from "../../api/endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "../../api/endpoints/constants";
import { getCategories } from "../../api/endpoints/products";
import CategoryModal from "../../components/Admin/CategoryModal";
import LoadingRow from "../../components/Admin/LoadingRow";
import AdminPageLayout from "../../components/Admin/PageLayout";
import TableActions from "../../components/Admin/RowActions";
import TableData from "../../components/Admin/TableData";
import TableRow from "../../components/Admin/TableRow";
import { HeaderConfig } from "../../types/admin";
import { Category } from "../../types/catalog";

const AdminCategories: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";
  const isModalOpen = lastSegment === "new";

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  const createDeleteLink = (id: number) => {
    return buildApiUrl(CATALOG_ENDPOINTS.CATEGORY_DETAILS, { id });
  };

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Name" },
    { title: "Slug" },
    { title: "Products" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  return (
    <>
      <AnimatePresence>{isModalOpen && <CategoryModal />}</AnimatePresence>
      <AdminPageLayout
        title="Categories"
        actionLink="new"
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
                <TableActions
                  editLink="/"
                  deleteLink={createDeleteLink(category.id)}
                  resourceType="Category"
                  queryKey={["categories"]}
                />
              </TableRow>
            ))}
          </>
        )}
      </AdminPageLayout>
    </>
  );
};

export default AdminCategories;
