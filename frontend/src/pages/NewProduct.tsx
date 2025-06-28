import { zodResolver } from "@hookform/resolvers/zod";
import { Check, DollarSign, Tag } from "lucide-react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import BackButton from "../components/Admin/BackButton";
import { NewProductForm } from "../types/forms";
import FloatingInput from "../components/FloatingInput";
import HorizontalDivider from "../components/HorizontalDivider";
import ProductSpecs from "../components/ProductForm/ProductSpecs";
import ImageInput from "../components/ProductForm/ImageInput";
import Button from "../components/Button";
import { Link } from "react-router";
import CategoryInput from "../components/ProductForm/CategoryInput";
import DescriptionInput from "../components/ProductForm/DescriptionInput";
import newProductSchema from "../schemas/newProduct";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../api/endpoints/products";
import { ApiFormError, ApiResponse } from "../types/api";
import { toast } from "../utils/customToast";
import { convertToFormData } from "../lib/convertToFormData";
import { isApiFormError } from "../utils/typeGuards";

const NewProduct: React.FC = () => {
  const methods = useForm<NewProductForm>({
    resolver: zodResolver(newProductSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

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

        <FormProvider {...methods}>
          <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="border-oyster/30 rounded-md border bg-white p-6">
              <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
                Basic Information
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                <FloatingInput
                  name="name"
                  label="Product Name"
                  icon={<Tag className="h-4 w-4" />}
                  error={errors.name?.message}
                />
                <FloatingInput
                  name="base_price"
                  label="Price"
                  icon={<DollarSign className="h-4 w-4" />}
                  error={errors.base_price?.message}
                />
                <CategoryInput error={errors.category?.message} />
                <DescriptionInput error={errors.description?.message} />
              </div>
            </div>
            <div className="border-oyster/30 rounded-md border bg-white p-6">
              <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
                Product Image
              </h2>
              <ImageInput error={errors.reference_image?.message} />
            </div>
            <div className="border-oyster/30 rounded-md border bg-white p-6">
              <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
                Product Details
              </h2>
              <div className="flex flex-col gap-12">
                <ProductSpecs
                  name="details"
                  label="Details"
                  placeholder="Add a product detail..."
                  error={errors.details?.message}
                />
                <ProductSpecs
                  name="materials"
                  label="Materials"
                  placeholder="Add a material..."
                  error={errors.materials?.message}
                />
                <ProductSpecs
                  name="care"
                  label="Care"
                  placeholder="Add a care instruction..."
                  error={errors.care?.message}
                />
              </div>
            </div>
            <div className="items-right flex justify-end gap-3">
              <Link
                to="/admin/products"
                className="border-mine-shaft/20 hover:bg-mine-shaft/10 cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors duration-300"
              >
                Cancel
              </Link>
              <Button
                loadingLabel="Creating..."
                isLoading={isPending}
                className="gap-2 bg-[#8b7a6c] duration-300 hover:bg-[#7b6c60] active:bg-[#7b6c60]"
              >
                <Check className="h-4 w-4" />
                Create Product
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default NewProduct;
