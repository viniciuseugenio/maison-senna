import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Tag } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { addVariationKind } from "../../api/endpoints/products";
import { variationKindsSchema } from "../../schemas/variations";
import { VariationKindsForm } from "../../types/forms";
import { toast } from "../../utils/customToast";
import Button from "../Button";
import FloatingInput from "../FloatingInput";
import FormModal from "./FormModal";
import { toastMessages } from "../../constants/auth";

const VariationKindsCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate(-1);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addVariationKind,
    mutationKey: ["createVariationKind"],
    onSuccess: () => {
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["variationKinds"] });
      toast.success({ title: toastMessages.admin.variationKindCreated.title });
    },
    onError: (error) => {
      if (error.errors) {
        toast.error({
          title: "An error occurred.",
          description: error.errors.name[0],
        });
        return;
      }
      toast.error({ title: error.detail, description: error.description });
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
