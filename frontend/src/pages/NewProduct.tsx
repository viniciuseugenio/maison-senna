import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { createProduct } from "../api/endpoints/products";
import BackButton from "../components/Admin/BackButton";
import HorizontalDivider from "../components/HorizontalDivider";
import ProductForm from "../components/ProductForm";
import { convertToFormData } from "../lib/convertToFormData";
import newProductSchema from "../schemas/newProduct";
import { ApiFormError, ApiResponse } from "../types/api";
import { NewProductForm } from "../types/forms";
import { toast } from "../utils/customToast";
import { isApiFormError } from "../utils/typeGuards";
import { useNavigate } from "react-router";

const NewProduct: React.FC = () => {
  const methods = useForm<NewProductForm>({
    resolver: zodResolver(newProductSchema),
  });
  const navigate = useNavigate();

  const { setError } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data: ApiFormError | ApiResponse) => {
      if (isApiFormError(data)) {
        Object.entries(data.errors).forEach(([key, error]) => {
          setError(key as keyof NewProductForm, {
            message: error[0],
          });
        });
        return;
      }

      toast.success({
        title: "The product was created.",
        description: "Now you need to create its variation options!",
      });
      navigate('/admin/products/')
    },
    onError: (error) => {
      toast.error({
        title: error.title,
        description: error.description,
      });
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
