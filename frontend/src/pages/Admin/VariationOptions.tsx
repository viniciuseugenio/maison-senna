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
    { title: "Variation Type" },
    { title: "Price Modifier" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  const onSearch = (query: string) => {
    if (!variationOptions) return;

    const result = variationOptions.filter((variationOption) =>
      variationOption.type.product.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredOptions(result);
  };

  const dataToRender =
    filteredOptions ??
    variationOptions?.sort((a, b) =>
      a.type.product.localeCompare(b.type.product),
    );

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
              <TableData>
                {variationOption.type.kind} ({variationOption.type.product})
              </TableData>
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
