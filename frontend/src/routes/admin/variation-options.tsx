import { PAGE_SIZE } from "@/api/constants";
import { queryKeys } from "@/api/queryKeys";
import { getProducts, getVariationOptions } from "@/api/services";
import {
  FormModal,
  LoadingRow,
  PageLayout,
  TableActions,
  TableData,
  TableRow,
} from "@/components/features/admin";
import { Pagination } from "@/components/ui";
import { useDebounce } from "@/hooks/useDebounce";
import { HeaderConfig, ProductList, VariationOptionList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  modal: z.literal("new").optional(),
  page: z.number().catch(1),
});

export const Route = createFileRoute("/admin/variation-options")({
  validateSearch: (search) => searchSchema.parse(search),
  component: VariationOptions,
});

function VariationOptions() {
  const { page, modal } = Route.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.variationOptions.list({ page }),
    queryFn: () => getVariationOptions({ page }),
  });
  const results = data?.results;
  const qtyPages = Math.ceil(data?.count / PAGE_SIZE);

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
    if (!results) return;

    if (!query.trim()) {
      setFilteredOptions(null);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const result = results.filter((option) => {
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

  const dataToRender = filteredOptions ?? results;

  return (
    <>
      <AnimatePresence>{modal && <VariationOptionModal />}</AnimatePresence>
      <PageLayout
        title="Variation Options"
        headers={headers}
        actionLabel="New Variation Option"
        actionLink="."
        linkSearch={{ modal: "new" }}
        onSearch={onSearch}
        qtyPages={qtyPages}
        dataCount={data?.count}
        resultsSize={results?.length}
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
}

const VariationOptionModal: React.FC = () => {
  const navigate = Route.useNavigate();
  const { q, page } = Route.useSearch();
  const debouncedSearch = useDebounce(q, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 7;
  const queryKeyFilters = {
    page,
    limit: itemsPerPage,
    search: debouncedSearch,
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.products.list(queryKeyFilters),
    queryFn: () => getProducts(queryKeyFilters),
  });

  const onClose = () => {
    navigate({ to: ".", search: (prev) => ({ ...prev, modal: undefined }) });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        q: e.target.value,
      }),
    });
  };

  const qtyPages = Math.ceil(data?.count / itemsPerPage);

  return (
    <FormModal
      onClose={onClose}
      isPending={isLoading}
      maxWidth="max-w-2xl"
      title="Select a Product"
    >
      <div className="mt-3 h-[810px] overflow-y-scroll p-1">
        <div className="bg-light outline-oyster flex rounded-md px-2 py-3">
          <input
            ref={inputRef}
            placeholder="Search products by name or SKU..."
            className="w-full outline-none"
            onChange={onSearch}
          />
          <button
            onClick={() => {
              navigate({
                to: ".",
                search: (prev) => ({ ...prev, q: undefined }),
              });
              inputRef.current!.value = "";
            }}
            className="text-mine-shaft cursor-pointer duration-300 hover:text-red-600"
            aria-label="Clean input search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="text-mine-shaft mt-6 flex max-w-full flex-col gap-3">
          {isLoading && <PageSkeleton itemsPerPage={itemsPerPage} />}
          {data?.results.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </ul>
      </div>
      <Pagination qtyPages={qtyPages} />
    </FormModal>
  );
};

const ProductRow: React.FC<{ product: ProductList }> = ({ product }) => {
  return (
    <>
      <li
        key={product.id}
        className="hover:bg-oyster/10 cursor-pointer rounded-md py-3 duration-300 hover:text-black"
      >
        <Link
          to="/admin/products/$postSlug/edit"
          params={{ postSlug: product.slug }}
          search={{ step: 1 }}
          className="group flex items-center justify-between px-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-md">
              <img
                src={product.referenceImage}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="title text-lg">{product.name}</p>
          </div>
          <ChevronRight className="text-mine-shaft/40 duration-300 group-hover:text-orange-700" />
        </Link>
      </li>
      <hr className="opacity-10" />
    </>
  );
};

const PageSkeleton: React.FC<{ itemsPerPage: number }> = ({ itemsPerPage }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <>
          <div key={i} className="flex items-center gap-3 px-3 py-3">
            <Skeleton borderRadius={8} width={56} height={56} />
            <Skeleton width={198} height={20} />
          </div>
          <hr className="opacity-10" />
        </>
      ))}
    </div>
  );
};
