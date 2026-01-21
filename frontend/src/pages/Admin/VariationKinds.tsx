import { buildApiUrl } from "@/api/endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "@/api/endpoints/constants";
import { getVariationKinds } from "@/api/endpoints/products";
import { HeaderConfig } from "@/types/admin";
import LoadingRow from "@components/features/admin/LoadingRow";
import PageLayout from "@components/features/admin/PageLayout";
import TableActions from "@components/features/admin/RowActions";
import TableData from "@components/features/admin/TableData";
import TableRow from "@components/features/admin/TableRow";
import VariationKindsCreate from "@components/features/admin/VariationKindsCreate";
import VariationKindsEdit from "@components/features/admin/VariationKindsEdit";
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
        {!variationKinds || isLoading ? (
          <LoadingRow colSpan={headers.length} />
        ) : (
          <>
            {variationKinds.map((variationKind) => (
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
