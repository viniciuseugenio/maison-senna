import { getVariationKinds } from "@/api/catalog/variations.service";
import { buildApiUrl } from "@/api/endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "@/api/endpoints/constants";
import { HeaderConfig } from "@/types/admin";
import {
  LoadingRow,
  PageLayout,
  TableActions,
  TableData,
  TableRow,
  VariationKindsCreate,
  VariationKindsEdit,
} from "@components/features/admin";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useMatch } from "react-router";

const VariationKinds: React.FC = () => {
  const matchNew = useMatch("/admin/variation-kinds/new");
  const matchEdit = useMatch("/admin/variation-kinds/edit/:id");

  const { data: variationKinds, isLoading } = useQuery({
    queryKey: ["variationKinds"],
    queryFn: getVariationKinds,
  });
  const results = variationKinds?.results;

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
        {!!matchNew && <VariationKindsCreate />}
        {!!matchEdit && <VariationKindsEdit />}
      </AnimatePresence>
      <PageLayout
        title="Variation Kinds"
        headers={headers}
        actionLabel="New Variation Kind"
        actionLink="new"
        onSearch={(query) => console.log(query)}
      >
        {!results || isLoading ? (
          <LoadingRow colSpan={headers.length} />
        ) : (
          <>
            {results.map((variationKind) => (
              <TableRow key={variationKind.id}>
                <TableData>{variationKind.id}</TableData>
                <TableData>{variationKind.name}</TableData>
                <TableActions
                  editLink={`/admin/variation-kinds/edit/${variationKind.id}`}
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
};

export default VariationKinds;
