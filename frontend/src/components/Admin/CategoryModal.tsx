import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { addCategory } from "../../api/endpoints/products";
import { categorySchema } from "../../schemas/category";
import { ApiResponse } from "../../types/api";
import { CategoryForm, CategoryFormError } from "../../types/forms";
import { toast } from "../../utils/customToast";
import FormModal from "./FormModal";
import { Tag, Plus } from "lucide-react";
import Button from "../Button";
import FloatingInput from "../FloatingInput";

const CategoryModal: React.FC = () => {
  const navigate = useNavigate();
  const closeModalUrl = "/admin/categories";
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate(closeModalUrl);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: addCategory,
    mutationKey: ["createCategory"],
    onSuccess: (data: CategoryFormError | ApiResponse) => {
      if ("errors" in data) {
        const errors = data.errors as Record<keyof CategoryForm, string[]>;
        toast.error({
          title: "An error occurred.",
          description: errors.name[0],
        });
        return;
      }
      navigate(closeModalUrl);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success({ title: "The category was successfully created." });
    },
    onError: (error) => {
      toast.error({ title: error.title, description: error.description });
    },
  });

  const methods = useForm({
    resolver: zodResolver(categorySchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<CategoryForm> = async (data) => {
    mutate(data);
  };

  return (
    <FormModal
      title="Create New Category"
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

export default CategoryModal;
