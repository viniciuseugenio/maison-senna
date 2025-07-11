import { useQuery } from "@tanstack/react-query";
import LoadingRow from "../../components/Admin/LoadingRow";
import PageLayout from "../../components/Admin/PageLayout";
import TableActions from "../../components/Admin/RowActions";
import TableData from "../../components/Admin/TableData";
import TableRow from "../../components/Admin/TableRow";
import { listVariationTypes } from "../../api/endpoints/products";
import { VariationTypeList } from "../../types/catalog";
import { HeaderConfig } from "../../types/admin";
import { useState } from "react";

const VariationTypes: React.FC = () => {
  const { data: variationTypes, isLoading } = useQuery<VariationTypeList[]>({
    queryKey: ["variationTypes"],
    queryFn: listVariationTypes,
  });

  const [filteredOptions, setFilteredOptions] = useState<
    VariationTypeList[] | null
  >(null);

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Kind" },
    { title: "Product" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  const onSearch = (query: string) => {
    if (!variationTypes) return;

    const result = variationTypes.filter((variationType) =>
      variationType.product.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredOptions(result);
  };

  const dataToRender = filteredOptions ?? variationTypes;

  return (
    <PageLayout
      title="Variation Types"
      headers={headers}
      actionLabel="New Variation Type"
      actionLink="/"
      onSearch={onSearch}
    >
      {!dataToRender || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        <>
          {dataToRender.map((variationType) => (
            <TableRow key={variationType.id}>
              <TableData>{variationType.id}</TableData>
              <TableData>{variationType.kind}</TableData>
              <TableData>{variationType.product}</TableData>
              <TableActions
                editLink="/"
                deleteLink="/"
                resourceType="Variation Type"
                queryKey={["variationTypes"]}
              />
            </TableRow>
          ))}
        </>
      )}
    </PageLayout>
  );
};

export default VariationTypes;
