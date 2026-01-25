import { getVariationOptions } from "@/api/endpoints/products";
import { HeaderConfig } from "@/types/admin";
import { VariationOptionList } from "@/types/catalog";
import LoadingRow from "@components/features/admin/LoadingRow";
import PageLayout from "@components/features/admin/PageLayout";
import TableActions from "@components/features/admin/RowActions";
import TableData from "@components/features/admin/TableData";
import TableRow from "@components/features/admin/TableRow";
import useLastSegment from "@hooks/lastSegment";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import VariationOptionModal from "./VariationOptionModal";

const VariationOptions: React.FC = () => {
  const lastSegment = useLastSegment();
  const isModalOpen = lastSegment === "new";

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
    { title: "Product" },
    { title: "Price Modifier" },
    { title: "ACTIONS", className: "text-right", isButton: false },
  ];

  const onSearch = (query: string) => {
    if (!variationOptions) return;

    if (!query.trim()) {
      setFilteredOptions(null);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const result = variationOptions.filter((option) => {
      const matchesName = option.name.toLowerCase().includes(lowerQuery);
      const matchesKind = option.kind.name.toLowerCase().includes(lowerQuery);
      const matchesProduct = option.product.name
        .toLowerCase()
        .includes(lowerQuery);
      const matchesId = option.id.toString().includes(lowerQuery);
      const matchesPrice = option.priceModifier
        ?.toString()
        .includes(lowerQuery);

      return (
        matchesName ||
        matchesKind ||
        matchesProduct ||
        matchesId ||
        matchesPrice
      );
    });

    setFilteredOptions(result);
  };

  const dataToRender = filteredOptions ?? variationOptions;

  return (
    <>
      <AnimatePresence>
        {isModalOpen && <VariationOptionModal />}
      </AnimatePresence>
      <PageLayout
        title="Variation Options"
        headers={headers}
        actionLabel="New Variation Option"
        actionLink="new"
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
                <TableData>{variationOption.product.name}</TableData>
                <TableData>
                  $
                  {variationOption.priceModifier
                    ? parseFloat(variationOption.priceModifier)
                    : "0.00"}
                </TableData>
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
    </>
  );
};

export default VariationOptions;
