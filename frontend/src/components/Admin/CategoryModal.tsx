import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Tag, X } from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCategory } from "../../api/endpoints/products";
import { categorySchema } from "../../schemas/category";
import { ApiResponse } from "../../types/api";
import { CategoryForm, CategoryFormError } from "../../types/forms";
import { toast } from "../../utils/customToast";
import Button from "../Button";
import FloatingInput from "../FloatingInput";
import HorizontalDivider from "../HorizontalDivider";

const CategoryModal: React.FC = () => {
  const navigate = useNavigate();
  const closeModalUrl = "/admin/categories";
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate(closeModalUrl);
  };

  const { mutate } = useMutation({
    mutationFn: createCategory,
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

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<CategoryForm> = async (data) => {
    console.log(data);
    mutate(data);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="border-oyster/30 relative z-20 min-w-md rounded-md border bg-white p-4 shadow-lg"
      >
        <button
          className="text-mine-shaft/60 absolute top-3 right-3 cursor-pointer duration-300 hover:text-red-600"
          onClick={onClose}
          aria-label="Close Modal"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-mine-shaft font-serif text-2xl font-light">
            Create New Category
          </h2>
          <HorizontalDivider className="mx-auto" />
        </div>
        <FormProvider {...methods}>
          <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
            <FloatingInput
              icon={<Tag className="h-4 w-4" />}
              name="name"
              label="Name"
            />
            <Button className="mt-4 w-full gap-2">
              <Plus className="h-4 w-4" />
              Create Category
            </Button>
          </form>
        </FormProvider>
      </motion.div>
    </div>,
    document.getElementById("modal"),
  );
};

export default CategoryModal;
