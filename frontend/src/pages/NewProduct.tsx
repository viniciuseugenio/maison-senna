import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createProduct } from "../api/endpoints/products";
import BackButton from "../components/Admin/BackButton";
import HorizontalDivider from "../components/HorizontalDivider";
import ProductForm from "../components/ProductForm";
import { convertToFormData } from "../lib/convertToFormData";
import newProductSchema from "../schemas/newProduct";
import { NewProductForm } from "../types/forms";
import { toast } from "../utils/customToast";
import { toastMessages } from "../constants/auth";

const NewProduct: React.FC = () => {
  const methods = useForm<NewProductForm>({
    resolver: zodResolver(newProductSchema),
    mode: "onBlur",
    defaultValues: {
      variations: [
        {
          id: crypto.randomUUID(),
          variationKind: undefined,
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
      navigate("/admin/products/");
    },
    onError: (error) => {
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, errorArray]) => {
          setError(
            key as keyof NewProductForm,
            {
              message: errorArray[0],
            },
            { shouldFocus: true },
          );
        });
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
          <HorizontalDivider />
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
};

export default NewProduct;
