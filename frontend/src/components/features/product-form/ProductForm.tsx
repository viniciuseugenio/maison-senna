import { ProductDetails } from "@/types/catalog";
import { NewProductForm } from "@/types/forms";
import CancelLink from "@components/shared/CancelLink";
import Button from "@components/ui/Button";
import { ArrowLeft, Check, Package, Palette } from "lucide-react";
import { useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { useSearchParams } from "react-router";
import BasicInfo from "./BasicInfo";
import StepInfo from "./StepInfo";
import Variations from "./Variations";

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
  const { handleSubmit, trigger } = methods;

  const getErrorMessage = (error: any) => {
    if (!error) return undefined;
    if (typeof error.message === "string") return error.message;
    return undefined;
  };

  const steps = [
    {
      icon: Package,
      label: "Basic Info",
      description: "Product details",
      fields: [
        "name",
        "basePrice",
        "description",
        "category",
        "details",
        "materials",
        "care",
        "referenceImage",
      ],
    },
    {
      icon: Palette,
      label: "Variations",
      description: "Types & Options",
      fields: ["variations"],
    },
  ];

  const qtySteps = steps.length - 1;
  const [searchParams, _] = useSearchParams();
  let step = Number(searchParams.get("step"));
  step = step > qtySteps ? qtySteps : step;
  const [currentStep, setCurrentStep] = useState(step ?? 0);

  const isLastStep = steps.length - 1 === currentStep;

  type FieldName = keyof NewProductForm;

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    setCurrentStep((prev) => (prev == steps.length - 1 ? prev : prev + 1));
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-6">
        {steps.map((step, i) => (
          <StepInfo
            key={i}
            Icon={step.icon}
            label={step.label}
            description={step.description}
            isLast={i === steps.length - 1}
            isComplete={currentStep > i}
            isCurrentStep={currentStep === i}
            onClick={() => setCurrentStep(i)}
          />
        ))}
      </div>

      <FormProvider {...methods}>
        <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <BasicInfo data={data} getErrorMessage={getErrorMessage} />
          )}

          {currentStep === 1 && <Variations data={data?.variationOptions} />}

          <div className="flex justify-between">
            <div>
              {currentStep !== 0 && (
                <Button
                  onClick={prevStep}
                  color="brown"
                  type="button"
                  className="text-oyster border-oyster/40 hover:bg-oyster gap-1 border bg-transparent hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous step
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <CancelLink to="/admin/products" />
              <Button
                type={isLastStep ? "submit" : "button"}
                loadingLabel="Saving..."
                isLoading={isPending}
                color="brown"
                className="gap-1"
                {...(!isLastStep ? { onClick: nextStep } : {})}
              >
                <Check className="h-4 w-4" />
                {isLastStep ? buttonLabel : "Go to next step"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

export default ProductForm;
