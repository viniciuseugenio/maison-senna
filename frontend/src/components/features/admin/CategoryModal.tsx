import { addCategory } from "@/api/endpoints/products";
import { toastMessages } from "@/constants/auth";
import { categorySchema } from "@/schemas/category";
import { CategoryForm } from "@/types/forms";
import { toast } from "@/utils/customToast";
import Button from "@components/ui/Button";
import FloatingInput from "@components/ui/FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Tag } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import FormModal from "./FormModal";

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
    onSuccess: () => {
      navigate(closeModalUrl);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success({ title: toastMessages.admin.categoryCreated.title });
    },
    onError: (error) => {
      if (error.errors) {
        toast.error({
          title: "An error occurred",
          description: error.errors.name[0],
        });
        return;
      }
      toast.error({ title: error.detail, description: error.description });
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
