import { buildApiUrl } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import { queryKeys } from "@/api/queryKeys";
import { getCategories } from "@/api/services";
import {
  AdminPageLayout,
  CategoryModal,
  LoadingRow,
  TableActions,
  TableData,
  TableRow,
} from "@/components/features/admin";
import { HeaderConfig } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { z } from "zod";

const searchSchema = z.object({
  modal: z.literal("new").optional(),
});

const categoriesQueryOptions = queryOptions({
  queryFn: getCategories,
  queryKey: queryKeys.categories.all,
});

export const Route = createFileRoute("/admin/categories")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(categoriesQueryOptions);
  },
  component: AdminCategories,
});

function AdminCategories() {
  const search = Route.useSearch();
  const modal = search.modal;

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
      <AnimatePresence>{modal && <CategoryModal />}</AnimatePresence>
      <AdminPageLayout
        title="Categories"
        actionLink="."
        linkSearch={{ modal: "new" }}
        actionLabel="New Category"
        headers={headers}
        onSearch={(query) => console.log(query)}
      >
        {!categories || isLoading ? (
          <LoadingRow colSpan={headers.length} />
        ) : (
          <>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableData>{category.id}</TableData>
                <TableData>{category.name}</TableData>
                <TableData>{category.slug}</TableData>
                <TableData>12</TableData>
                <TableActions
                  editLink="/"
                  deleteLink={createDeleteLink(category.slug)}
                  resourceType="Category"
                  queryKey={queryKeys.categories.all}
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
