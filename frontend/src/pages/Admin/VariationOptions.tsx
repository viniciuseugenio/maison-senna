import { useQuery } from "@tanstack/react-query";
import { getVariationOptions } from "../../api/endpoints/products";
import LoadingRow from "../../components/Admin/LoadingRow";
import PageLayout from "../../components/Admin/PageLayout";
import TableActions from "../../components/Admin/RowActions";
import TableData from "../../components/Admin/TableData";
import TableRow from "../../components/Admin/TableRow";
import { HeaderConfig } from "../../types/admin";
import { VariationOptionList } from "../../types/catalog";
import { useState } from "react";

const VariationOptions: React.FC = () => {
  const { data: variationOptions, isLoading } = useQuery({
    queryKey: ["variationOptions"],
    queryFn: getVariationOptions,
  });
  const [filteredOptions, setFilteredOptions] = useState<
    VariationOptionList[] | null
  >(null);

  const headers: HeaderConfig[] = [
    { title: "ID" },
    { title: "Name" },
    { title: "Variation Kind" },
    { title: "Price Modifier" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  // Does not work until the back-end returns a product variable again
  const onSearch = (query: string) => {
    if (!variationOptions) return;

    const result = variationOptions;

    setFilteredOptions(result);
  };

  const dataToRender = filteredOptions ?? variationOptions;

  return (
    <PageLayout
      title="Variation Options"
      headers={headers}
      actionLabel="New Variation Option"
      actionLink="/"
      onSearch={onSearch}
    >
      {!dataToRender || isLoading ? (
        <LoadingRow colSpan={headers.length} />
      ) : (
        <>
          {dataToRender.map((variationOption) => (
            <TableRow key={variationOption.id}>
              <TableData>{variationOption.id}</TableData>
              <TableData>{variationOption.name}</TableData>
              <TableData>{variationOption.kind.name}</TableData>
              <TableData>${variationOption.priceModifier ?? "0.00"}</TableData>
              <TableActions
                editLink="/"
                deleteLink="/"
                resourceType="Variation Option"
                queryKey={["variationOptions"]}
              />
            </TableRow>
          ))}
        </>
      )}
    </PageLayout>
  );
};

export default VariationOptions;
