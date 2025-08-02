import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { addVariationKind } from "../../api/endpoints/products";
import { variationKindsSchema } from "../../schemas/variationTypes";
import { ApiResponse } from "../../types/api";
import { VariationKindsForm, VariationKindsFormError } from "../../types/forms";
import { toast } from "../../utils/customToast";
import FormModal from "./FormModal";
import FloatingInput from "../FloatingInput";
import { Plus, Tag } from "lucide-react";
import Button from "../Button";

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
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<VariationKindsForm> = async (data) => {
    mutate(data);
  };

  return (
    <FormModal
      title="Create New Variation Kind"
      onClose={onClose}
      isPending={isPending}
    >
      <FormProvider {...methods}>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <FloatingInput
            icon={<Tag className="h-4 w-4" />}
            name="name"
            label="Name"
            error={errors?.name?.message}
          />
          <Button
            isLoading={isPending}
            loadingLabel="Creating..."
            className="mt-4 w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </form>
      </FormProvider>
    </FormModal>
  );
};

export default VariationKindsCreate;
