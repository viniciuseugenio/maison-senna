import { DollarSign, Tag } from "lucide-react";
import { useFormContext } from "react-hook-form";
import FloatingInput from "../FloatingInput";
import CategoryInput from "./CategoryInput";
import DescriptionInput from "./DescriptionInput";
import ImageInput from "./ImageInput";
import ProductSpecs from "./ProductSpecs";
import { BasicInfoProps } from "./types";

const BasicInfo: React.FC<BasicInfoProps> = ({ getErrorMessage, data }) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <>
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
    </>
  );
};

export default BasicInfo;
