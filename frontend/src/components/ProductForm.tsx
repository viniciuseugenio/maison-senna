import { Check, DollarSign, Tag } from "lucide-react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { Link } from "react-router";
import Button from "./Button";
import FloatingInput from "./FloatingInput";
import CategoryInput from "./ProductForm/CategoryInput";
import DescriptionInput from "./ProductForm/DescriptionInput";
import ImageInput from "./ProductForm/ImageInput";
import ProductSpecs from "./ProductForm/ProductSpecs";
import { ProductDetails } from "../types/catalog";
import CancelLink from "./CancelLink";

type ProductFormProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  data?: ProductDetails;
  isPending: boolean;
  onSubmit: SubmitHandler<T>;
  buttonLabel: string;
};

function ProductForm<T extends FieldValues>({
  methods,
  data,
  isPending,
  onSubmit,
  buttonLabel,
}: ProductFormProps<T>) {
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const getErrorMessage = (error: any) => {
    if (!error) return undefined;
    if (typeof error.message === "string") return error.message;
    return undefined;
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
        <div className="border-oyster/30 rounded-md border bg-white p-6">
          <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
            Basic Information
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FloatingInput
              defaultValue={data?.name}
              name="name"
              label="Product Name"
              icon={<Tag className="h-4 w-4" />}
              error={getErrorMessage(errors.name)}
            />
            <FloatingInput
              defaultValue={data?.basePrice}
              name="basePrice"
              label="Price"
              icon={<DollarSign className="h-4 w-4" />}
              error={getErrorMessage(errors.basePrice)}
            />
            <CategoryInput
              value={data?.category}
              error={getErrorMessage(errors.category)}
            />
            <DescriptionInput
              value={data?.description}
              error={getErrorMessage(errors.description)}
            />
          </div>
        </div>
        <div className="border-oyster/30 rounded-md border bg-white p-6">
          <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
            Product Image
          </h2>
          <ImageInput
            value={data?.referenceImage}
            error={getErrorMessage(errors.referenceImage)}
          />
        </div>
        <div className="border-oyster/30 rounded-md border bg-white p-6">
          <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
            Product Details
          </h2>
          <div className="flex flex-col gap-12">
            <ProductSpecs
              name="details"
              value={data?.details}
              label="Details"
              placeholder="Add a product detail..."
              error={getErrorMessage(errors.details)}
            />
            <ProductSpecs
              name="materials"
              value={data?.materials}
              label="Materials"
              placeholder="Add a material..."
              error={getErrorMessage(errors.materials)}
            />
            <ProductSpecs
              name="care"
              value={data?.care}
              label="Care"
              placeholder="Add a care instruction..."
              error={getErrorMessage(errors.care)}
            />
          </div>
        </div>
        <div className="items-right flex justify-end gap-3">
          <CancelLink to="/admin/products" />
          <Button loadingLabel="Saving..." isLoading={isPending} color="brown">
            <Check className="h-4 w-4" />
            {buttonLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default ProductForm;
