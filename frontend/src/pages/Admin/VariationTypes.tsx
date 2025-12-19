import { useQuery } from "@tanstack/react-query";
import LoadingRow from "../../components/Admin/LoadingRow";
import PageLayout from "../../components/Admin/PageLayout";
import TableActions from "../../components/Admin/RowActions";
import TableData from "../../components/Admin/TableData";
import TableRow from "../../components/Admin/TableRow";
import { getVariationTypes } from "../../api/endpoints/products";
import { VariationTypeList } from "../../types/catalog";
import { HeaderConfig } from "../../types/admin";
import { useState } from "react";
import { buildApiUrl } from "../../api/endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "../../api/endpoints/constants";

const VariationTypes: React.FC = () => {
  const { data: variationTypes, isLoading } = useQuery({
    queryKey: ["variationTypes"],
    queryFn: getVariationTypes,
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

  const buildDeleteLink = (id) => {
    return buildApiUrl(CATALOG_ENDPOINTS.VARIATION_TYPES_DETAILS, { id });
  };

  const dataToRender = filteredOptions ?? variationTypes;

  return (
    <PageLayout
      title="Variation Types"
      headers={headers}
      actionLabel="New Variation Type"
      actionLink="/admin/variation-types/new/"
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
                deleteLink={buildDeleteLink(variationType.id)}
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
