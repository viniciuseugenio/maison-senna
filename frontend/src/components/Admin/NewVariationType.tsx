import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { addVariationType } from "../../api/endpoints/products";
import { toast } from "../../utils/customToast";
import Button from "../Button";
import CancelLink from "../CancelLink";
import ProductSelect from "./ProductSelect";
import VariationKindSelect from "./VariationKindSelect";
import { newVariationType } from "../../schemas/variationTypes";
import { NewVariationTypeForm } from "../../types/forms";

const NewVariationType: React.FC = () => {
  const methods = useForm({
    resolver: zodResolver(newVariationType),
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { handleSubmit, setError } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: addVariationType,
    mutationKey: ["addVariationType"],
    onSuccess: (data) => {
      if (data.errors) {
        Object.entries(data.errors).forEach(([key, error]) =>
          setError(key as keyof NewVariationTypeForm, {
            message: error[0],
          }),
        );
        return;
      }

      toast.success({
        title: "Variation type successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["variationTypes"] });
      navigate("/admin/variation-types");
    },
  });

  const onSubmit: SubmitHandler<NewVariationTypeForm> = (data) => {
    mutate(data);
  };

  return (
    <div className="border-oyster/30 rounded-md border bg-white p-6">
      <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
        Create Variation Type
      </h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3">
            <VariationKindSelect />
            <ProductSelect />
          </div>
          <div className="mt-3 flex justify-end gap-3">
            <CancelLink to="/admin/variation-types" />
            <Button
              loadingLabel="Creating..."
              isLoading={isPending}
              color="brown"
            >
              Create Variation Type
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
export default NewVariationType;
