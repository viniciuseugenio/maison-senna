import { useQuery } from "@tanstack/react-query";
import PageLayout from "../../components/Admin/PageLayout";
import { getVariationKinds } from "../../api/endpoints/products";
import LoadingRow from "../../components/Admin/LoadingRow";
import { HeaderConfig } from "../../types/admin";
import TableRow from "../../components/Admin/TableRow";
import { VariationKind } from "../../types/catalog";
import TableData from "../../components/Admin/TableData";
import TableActions from "../../components/Admin/RowActions";

const VariationKinds: React.FC = () => {
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
    <PageLayout
      title="Variation Kinds"
      headers={headers}
      actionLabel="New Variation Kind"
      actionLink="/"
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
  );
};

export default VariationKinds;
