import { buildApiUrl } from "@/api/client";
import { CATALOG_ENDPOINTS, PAGE_SIZE } from "@/api/constants";
import { queryKeys } from "@/api/queryKeys";
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
import EditLink from "@/components/features/admin/EditLink";
import { HeaderConfig } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { AnimatePresence } from "motion/react";
import { z } from "zod";

const searchSchema = z
  .discriminatedUnion("modal", [
    z.object({ modal: z.literal("new"), page: z.number().catch(1) }),
    z.object({
      modal: z.literal("edit"),
      id: z.coerce.number().positive(),
      page: z.number().catch(1),
    }),
  ])
  .or(
    z
      .object({
        page: z.number().catch(1),
      })
      .passthrough(),
  );

const variationKindsQueryOptions = (page: number) =>
  queryOptions({
    queryKey: queryKeys.variationKinds.list(),
    queryFn: () => getVariationKinds({ page }),
  });

export const Route = createFileRoute("/admin/variation-kinds")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ context: { queryClient }, deps: { page } }) => {
    queryClient.ensureQueryData(variationKindsQueryOptions(page));
  },
  component: VariationKinds,
});

function VariationKinds() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { page } = search;

  const { data, isLoading } = useQuery(variationKindsQueryOptions(page));
  const results = data?.results;
  const qtyPages = Math.ceil(data?.count / PAGE_SIZE);

  const buildDeleteLink = (id: number) => {
    return buildApiUrl(CATALOG_ENDPOINTS.VARIATION_KINDS_DETAIL, { id });
  };

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Name" },
    { title: "SKU Abbreviation" },
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
        qtyPages={qtyPages}
        resultsSize={results?.length}
        dataCount={data?.count}
      >
        {!results || isLoading ? (
          <LoadingRow colSpan={headers.length} />
        ) : (
          <>
            {results.map((variationKind) => (
              <TableRow key={variationKind.id}>
                <TableData>{variationKind.id}</TableData>
                <TableData>{variationKind.name}</TableData>
                <TableData>{variationKind.skuAbbr}</TableData>
                <TableActions
                  renderEditLink={() => (
                    <EditLink
                      to="."
                      search={(prev) => ({
                        ...prev,
                        modal: "edit",
                        id: variationKind.id,
                      })}
                    />
                  )}
                  deleteLink={buildDeleteLink(variationKind.id)}
                  resourceType="Variation Kind"
                  queryKey={queryKeys.variationKinds.all}
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
