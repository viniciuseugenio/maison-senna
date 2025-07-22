import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { addVariationKind } from "../../api/endpoints/products";
import { variationKindsSchema } from "../../schemas/variationTypes";
import { ApiResponse } from "../../types/api";
import { VariationKindsForm, VariationKindsFormError } from "../../types/forms";
import { toast } from "../../utils/customToast";
import FormModal from "./FormModal";

const VariationKindsCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate(-1);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addVariationKind,
    mutationKey: ["createVariationKind"],
    onSuccess: (data: VariationKindsFormError | ApiResponse) => {
      if ("errors" in data) {
        const errors = data.errors as Record<
          keyof VariationKindsForm,
          string[]
        >;
        toast.error({
          title: "An error occurred.",
          description: errors.name[0],
        });
        return;
      }
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["variationKinds"] });
      toast.success({ title: "The variation kind was successfully created." });
    },
    onError: (error) => {
      toast.error({ title: error.title, description: error.description });
    },
  });

  const methods = useForm({
    resolver: zodResolver(variationKindsSchema),
  });

  const onSubmit: SubmitHandler<VariationKindsForm> = async (data) => {
    mutate(data);
  };

  return (
    <FormModal
      onSubmit={onSubmit}
      modelName="Variation Kind"
      onClose={onClose}
      isPending={isPending}
      methods={methods}
    />
  );
};

export default VariationKindsCreate;
