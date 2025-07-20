import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { getVariationKinds } from "../../api/endpoints/products";
import LoadingRow from "../../components/Admin/LoadingRow";
import PageLayout from "../../components/Admin/PageLayout";
import TableActions from "../../components/Admin/RowActions";
import TableData from "../../components/Admin/TableData";
import TableRow from "../../components/Admin/TableRow";
import VariationKindsModel from "../../components/Admin/VariationKindsModel";
import useLastSegment from "../../hooks/lastSegment";
import { HeaderConfig } from "../../types/admin";
import { VariationKind } from "../../types/catalog";

const VariationKinds: React.FC = () => {
  const lastSegment = useLastSegment();
  const isModalOpen = lastSegment === "new";

  const { data: variationKinds, isLoading } = useQuery<VariationKind[]>({
    queryKey: ["variationKinds"],
    queryFn: getVariationKinds,
  });

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Name" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  return (
    <>
      <AnimatePresence>
        {isModalOpen && <VariationKindsModel />}
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
                  editLink="/"
                  deleteLink="/"
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
