import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { addCategory } from "../../api/endpoints/products";
import { categorySchema } from "../../schemas/category";
import { ApiResponse } from "../../types/api";
import { CategoryForm, CategoryFormError } from "../../types/forms";
import { toast } from "../../utils/customToast";
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

  const onSubmit: SubmitHandler<CategoryForm> = async (data) => {
    mutate(data);
  };

  return (
    <FormModal
      onClose={onClose}
      modelName="Category"
      onSubmit={onSubmit}
      methods={methods}
      isPending={isPending}
    />
  );
};

export default CategoryModal;
