import { queryKeys } from "@/api/queryKeys";
import { getProduct, updateProduct } from "@/api/services";
import { BackButton } from "@/components/features/admin";
import { ProductForm } from "@/components/features/product-form";
import { HorizontalDivider } from "@/components/ui";
import newProduct from "@/schemas/newProduct";
import { NewProductForm } from "@/types";
import { toast } from "@/utils/customToast";
import { getUpdatedFields, partialFormData } from "@/utils/products/helpers";
import { setServerErrors } from "@/utils/setServerErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const searchSchema = z.object({
  step: z.coerce.number().int().min(0).default(0),
});

const productQueryOptions = (slug: string) =>
  queryOptions({
    queryFn: () => getProduct(slug as string),
    queryKey: queryKeys.products.detail(slug),
  });

export const Route = createFileRoute("/admin/products_/$postSlug/edit")({
  validateSearch: (search) => searchSchema.parse(search),
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(productQueryOptions(params.postSlug));
  },
  component: EditProduct,
});

function EditProduct() {
  const { postSlug: slug } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: product } = useSuspenseQuery(productQueryOptions(slug));

  const methods = useForm({
    resolver: zodResolver(newProduct.partial()),
  });
  const { setError } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      updateProduct({ data, slug: slug as string }),
    mutationKey: ["products", slug],
    onSuccess: (data) => {
      toast.success({
        title: data.detail,
        description: data.description,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
    onError: (error) => {
      if (error.errors) {
        setServerErrors(setError, error.errors);
        toast.error({ title: error.detail, description: error.description });
      } else {
        toast.error({
          title: error.detail,
          description: error.description,
        });
      }
    },
  });

  const onSubmit: SubmitHandler<NewProductForm> = async (data) => {
    const updatedFields = getUpdatedFields(product!, data);
    if (Object.keys(updatedFields).length === 0) {
      toast.warning({ title: "Nothing was changed." });
      return;
    }

    const formData = partialFormData(updatedFields);
    mutate(formData);
  };

  return (
    <section>
      <BackButton label="Products" link="/admin/products" />
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
            Edit A Product
          </h1>
          <HorizontalDivider className="mt-4" />
        </div>

        <ProductForm<Partial<NewProductForm>>
          methods={methods}
          data={product}
          onSubmit={onSubmit}
          isPending={isPending}
          buttonLabel="Edit Product"
        />
      </div>
    </section>
  );
}

export default EditProduct;
