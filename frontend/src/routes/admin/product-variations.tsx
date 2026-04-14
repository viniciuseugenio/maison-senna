import { queryKeys } from "@/api/queryKeys";
import {
  getProductVariation,
  getProductVariations,
  updateProductVariation,
} from "@/api/services";
import {
  FormModal,
  PageLayout,
  TableActions,
  TableData,
  TableRow,
} from "@/components/features/admin";
import EditLink from "@/components/features/admin/EditLink";
import TableLayout from "@/components/features/admin/TableLayout";
import { ImageInput } from "@/components/features/product-form";
import { Button, FloatingInput } from "@/components/ui";
import { HeaderConfig, ProductWithVariations } from "@/types";
import { calcVariantPrice } from "@/utils/calcVariantPrice";
import { toast } from "@/utils/customToast";
import { formatPrice } from "@/utils/formatPrice";
import { calcPageSizeAndQty } from "@/utils/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Archive, ChevronDown, Image, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const headers: HeaderConfig[] = [
  { title: "ID" },
  { title: "IMAGE", isButton: false },
  { title: "SKU" },
  { title: "OPTIONS", isButton: false },
  { title: "STOCK" },
  { title: "BASE PRICE" },
  { title: "VARIATION PRICE" },
  { title: "ACTIONS", isButton: false, className: "text-right" },
];

const searchSchema = z
  .object({
    page: z.number().catch(1),
    open: z.number().optional(),
    modal: z.literal("edit").optional(),
    id: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.modal) {
        return !!data.id;
      }
      return true;
    },
    { message: "id is required when modal exists", path: ["id"] },
  );

type SearchSchema = z.infer<typeof searchSchema>;

const productVariationsQueryOptions = (page: number) =>
  queryOptions({
    queryKey: queryKeys.productVariations.list({ page }),
    queryFn: () => getProductVariations({ page }),
  });

export const Route = createFileRoute("/admin/product-variations")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ context: { queryClient }, deps: { page } }) => {
    return queryClient.ensureQueryData(productVariationsQueryOptions(page));
  },
  component: ProductVariations,
});

function ProductVariations() {
  const { page, modal, id } = Route.useSearch();

  const { data } = useQuery(productVariationsQueryOptions(page));

  const results = data?.results;
  const { qtyPages } = calcPageSizeAndQty(results?.length, data?.count);
  const modalIsOpen = modal === "edit" && id != null;

  return (
    <>
      <AnimatePresence>
        {modalIsOpen && <EditModal id={id} isOpen={modalIsOpen} />}
      </AnimatePresence>

      <PageLayout
        title="Product Variations"
        actionLabel="New Product Variation"
        actionLink="/"
        qtyPages={qtyPages}
        resultsSize={results?.length}
        dataCount={data?.count}
        type="nested-list"
        onSearch={() => {}}
      >
        <div className="">
          {results &&
            results.map((product) => (
              <div key={product.id}>
                {product.variations.length > 0 && (
                  <ProductRow product={product} />
                )}
              </div>
            ))}
        </div>
      </PageLayout>
    </>
  );
}

const ProductRow: React.FC<{ product: ProductWithVariations }> = ({
  product,
}) => {
  const navigate = Route.useNavigate();
  const { open } = Route.useSearch();
  const isOpen = open === product.id;

  const updateSearchParams = (prev: SearchSchema) => {
    const openId = prev.open;
    return { ...prev, open: product.id !== openId ? product.id : undefined };
  };

  const toggleVariation = () => {
    navigate({
      to: ".",
      search: updateSearchParams,
    });
  };

  const stockIndicatorColor = (stock: number) => {
    let color = "bg-green-600";

    if (stock < 20) {
      color = "bg-red-600";
    } else if (stock <= 30) {
      color = "bg-yellow-500";
    }

    return color;
  };

  return (
    <div className="p-2">
      <button
        onClick={toggleVariation}
        className="hover:bg-oyster/20 flex w-full cursor-pointer items-center justify-between gap-2 p-4 duration-300"
      >
        <div className="flex items-center gap-6">
          <img src={product.referenceImage} className="aspect-square w-16" />
          <div className="flex flex-col items-start">
            <p className="title text-xl">{product.name}</p>
            <p className="text-mine-shaft/60 text-xs font-medium tracking-widest uppercase">
              {product.category.name}
            </p>
          </div>
        </div>
        <ChevronDown
          aria-label={isOpen ? "Hide variations" : "Show variations"}
          className={`h-5 w-5 duration-300 ${isOpen ? "" : "rotate-180"}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mr-3 overflow-hidden"
          >
            <TableLayout headers={headers}>
              {product.variations.map((variation) => (
                <TableRow key={variation.id}>
                  <TableData>{variation.id}</TableData>
                  <TableData>
                    {variation.image ? (
                      <img
                        src={variation.image}
                        className="aspect-square w-14"
                      />
                    ) : (
                      <Image className="h-10 w-10" />
                    )}
                  </TableData>
                  <TableData>{variation.sku}</TableData>
                  <TableData>
                    <div className="flex gap-2">
                      {variation.options.map((option) => (
                        <p
                          key={option.id}
                          className="bg-oyster/15 rounded-full px-2 py-1 text-xs"
                        >
                          {option.name}
                        </p>
                      ))}
                    </div>
                  </TableData>
                  <TableData className="pl-0">
                    <div className="flex items-center justify-items-start gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${stockIndicatorColor(variation.stock)}`}
                      />
                      <span>{variation.stock} in stock</span>
                    </div>
                  </TableData>
                  <TableData>{formatPrice(product.basePrice)}</TableData>
                  <TableData>
                    {formatPrice(
                      calcVariantPrice(
                        Number(product.basePrice),
                        variation.options,
                      ),
                    )}
                  </TableData>
                  <TableActions
                    deleteLink="oi"
                    resourceType="Product Variant"
                    queryKey={queryKeys.productVariations.all}
                    renderEditLink={() => (
                      <EditLink
                        to="."
                        search={(prev) => ({
                          ...prev,
                          modal: "edit",
                          id: variation.id,
                        })}
                        resetScroll={false}
                      />
                    )}
                  />
                </TableRow>
              ))}
            </TableLayout>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const editFormSchema = z.object({
  stock: z.coerce.number().optional(),
  image: z.instanceof(File).optional(),
});
type EditFormSchema = z.infer<typeof editFormSchema>;

const EditModal: React.FC<{ id: number; isOpen: boolean }> = ({
  id,
  isOpen,
}) => {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const methods = useForm({
    resolver: zodResolver(editFormSchema),
  });
  const { handleSubmit } = methods;

  const { data: variation, isLoading } = useQuery({
    queryKey: queryKeys.productVariations.details(id),
    queryFn: () => getProductVariation({ id: id }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { stock?: number; image?: File }) =>
      updateProductVariation({ id: id, data }),
    onSuccess: () => {
      toast.success({ title: "Updated succesfully" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.productVariations.all,
      });
      onClose();
    },
  });

  const onSubmit: SubmitHandler<EditFormSchema> = async (data) => {
    mutate(data);
  };

  const onClose = () => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, id: undefined, modal: undefined }),
      resetScroll: false,
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <FormModal
      title="Edit the Variant"
      isOpen={isOpen}
      onClose={onClose}
      isPending={isPending}
    >
      <FormProvider {...methods}>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FloatingInput
            name="sku"
            label="SKU"
            icon={<Tag className="h-4 w-4" />}
            disabled
            defaultValue={variation?.sku}
          />
          <FloatingInput
            name="stock"
            type="number"
            label="Stock"
            icon={<Archive className="h-4 w-4" />}
            defaultValue={variation?.stock}
          />
          <ImageInput name="image" value={variation?.image} />
          <Button>EDIT</Button>
        </form>
      </FormProvider>
    </FormModal>
  );
};

export default ProductVariations;
