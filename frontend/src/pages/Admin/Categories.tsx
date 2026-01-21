import { buildApiUrl } from "@/api/endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "@/api/endpoints/constants";
import { getCategories } from "@/api/endpoints/products";
import { HeaderConfig } from "@/types/admin";
import CategoryModal from "@components/features/admin/CategoryModal";
import LoadingRow from "@components/features/admin/LoadingRow";
import AdminPageLayout from "@components/features/admin/PageLayout";
import TableActions from "@components/features/admin/RowActions";
import TableData from "@components/features/admin/TableData";
import TableRow from "@components/features/admin/TableRow";
import useLastSegment from "@hooks/lastSegment";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";

const AdminCategories: React.FC = () => {
  const lastSegment = useLastSegment();
  const isModalOpen = lastSegment === "new";

  const { data: categories, isLoading } = useQuery({
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
