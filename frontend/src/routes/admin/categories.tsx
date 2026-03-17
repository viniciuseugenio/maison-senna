import { buildApiUrl } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import { getCategories } from "@/api/services";
import {
  AdminPageLayout,
  CategoryModal,
  LoadingRow,
  TableActions,
  TableData,
  TableRow,
} from "@/components/features/admin";
import useLastSegment from "@/hooks/lastSegment";
import { HeaderConfig } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";

const categoriesQueryOptions = queryOptions({
  queryFn: getCategories,
  queryKey: ["categories"],
});

export const Route = createFileRoute("/admin/categories")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(categoriesQueryOptions);
  },
  component: AdminCategories,
});

function AdminCategories() {
  const lastSegment = useLastSegment();
  const isModalOpen = lastSegment === "new";

  const { data: categories, isLoading } = useQuery(categoriesQueryOptions);

  const createDeleteLink = (slug: string) => {
    return buildApiUrl(CATALOG_ENDPOINTS.CATEGORY_DETAILS, { slug });
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
                  deleteLink={createDeleteLink(category.slug)}
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
}

export default AdminCategories;
