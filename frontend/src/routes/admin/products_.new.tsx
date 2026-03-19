import { createProduct } from "@/api/services";
import { BackButton } from "@/components/features/admin";
import { ProductForm } from "@/components/features/product-form";
import { HorizontalDivider } from "@/components/ui";
import { toastMessages } from "@/constants/auth";
import { convertToFormData } from "@/lib/convertToFormData";
import newProductSchema from "@/schemas/newProduct";
import { NewProductForm } from "@/types";
import { toast } from "@/utils/customToast";
import { setServerErrors } from "@/utils/setServerErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const searchSchema = z.object({
  step: z.coerce.number().int().min(0).default(0),
});

export const Route = createFileRoute("/admin/products_/new")({
  validateSearch: (search) => searchSchema.parse(search),
  component: NewProduct,
});

function NewProduct() {
  const methods = useForm<NewProductForm>({
    resolver: zodResolver(newProductSchema),
    mode: "onBlur",
    defaultValues: {
      variationOptions: [
        {
          idx: crypto.randomUUID(),
          kind: 0,
          options: [],
        },
      ],
    },
  });
  const navigate = useNavigate();

  const { setError } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success({
        title: data.detail,
        description: data.description,
      });
      navigate({ to: "/admin/products" });
    },
    onError: (error) => {
      if (error.errors) {
        setServerErrors(setError, error.errors);
        toast.error({
          title: toastMessages.formSubmissionFailed.title,
          description: toastMessages.formSubmissionFailed.description,
        });
      } else {
        toast.error({
          title: error.detail,
          description: error.description,
        });
      }
    },
  });

  const onSubmit: SubmitHandler<NewProductForm> = async (data) => {
    const formData = convertToFormData(data);
    mutate(formData);
  };

  return (
    <section>
      <BackButton label="Products" link="/admin/products" />
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
            Create New Product
          </h1>
          <HorizontalDivider className="mt-4" />
        </div>

        <ProductForm<NewProductForm>
          methods={methods}
          isPending={isPending}
          onSubmit={onSubmit}
          buttonLabel="Create Product"
        />
      </div>
    </section>
  );
}

export default NewProduct;
