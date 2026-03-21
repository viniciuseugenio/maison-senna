import { buildApiUrl } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import { getVariationKinds } from "@/api/services";
import {
  LoadingRow,
  PageLayout,
  TableActions,
  TableData,
  TableRow,
  VariationKindsCreate,
  VariationKindsEdit,
} from "@/components/features/admin";
import { HeaderConfig } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { z } from "zod";

const searchSchema = z
  .discriminatedUnion("modal", [
    z.object({ modal: z.literal("new") }),
    z.object({ modal: z.literal("edit"), id: z.coerce.number().positive() }),
  ])
  .or(z.object({}).passthrough());

const variationKindsQueryOptions = queryOptions({
  queryKey: ["variationKinds"],
  queryFn: getVariationKinds,
});

export const Route = createFileRoute("/admin/variation-kinds")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(variationKindsQueryOptions);
  },
  component: VariationKinds,
});

function VariationKinds() {
  const search = Route.useSearch();

  const { data: variationKinds, isLoading } = useQuery(
    variationKindsQueryOptions,
  );
  const buildDeleteLink = (id: number) => {
    return buildApiUrl(CATALOG_ENDPOINTS.VARIATION_KINDS_DETAIL, { id });
  };

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Name" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  return (
    <>
      <AnimatePresence>
        {search.modal === "new" && <VariationKindsCreate />}
        {search.modal === "edit" && <VariationKindsEdit />}
      </AnimatePresence>

      <PageLayout
        title="Variation Kinds"
        headers={headers}
        actionLabel="New Variation Kind"
        actionLink="."
        linkSearch={{ modal: "new" }}
        onSearch={(query) => console.log(query)}
      >
        {!variationKinds || isLoading ? (
          <LoadingRow colSpan={headers.length} />
        ) : (
          <>
            {variationKinds.map((variationKind) => (
              <TableRow key={variationKind.id}>
                <TableData>{variationKind.id}</TableData>
                <TableData>{variationKind.name}</TableData>
                <TableActions
                  editLink={`/admin/variation-kinds?modal=edit&id=${variationKind.id}`}
                  deleteLink={buildDeleteLink(variationKind.id)}
                  resourceType="Variation Kind"
                  queryKey={["variationKinds"]}
                />
              </TableRow>
            ))}
          </>
        )}
      </PageLayout>
    </>
  );
}

export default VariationKinds;
