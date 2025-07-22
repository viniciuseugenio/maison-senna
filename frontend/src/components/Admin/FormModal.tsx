import { Plus, Tag, X } from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { FormProvider, UseFormReturn } from "react-hook-form";
import Button from "../Button";
import FloatingInput from "../FloatingInput";
import HorizontalDivider from "../HorizontalDivider";

type FormModalProps<T> = {
  onClose: () => void;
  isPending: boolean;
  methods: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  defaultValue?: string;
  isEdit?: boolean;

  /**
   * The name of the model that is being created.
   * (e.g Category, Variation Kind)
   */
  modelName: string;
};

export default function FormModal<T>({
  methods,
  onClose,
  isPending,
  onSubmit,
  defaultValue,
  isEdit,
  modelName,
}: FormModalProps<T>) {
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const labels = isEdit ? "Edit" : "Create New";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="border-oyster/30 relative z-20 min-w-md rounded-md border bg-white p-4 shadow-lg"
      >
        <button
          className="text-mine-shaft/60 absolute top-3 right-3 cursor-pointer duration-300 hover:text-red-600"
          onClick={onClose}
          disabled={isPending}
          aria-label="Close Modal"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-mine-shaft font-serif text-2xl font-light">
            {labels} {modelName}
          </h2>
          <HorizontalDivider className="mx-auto" />
        </div>
        <FormProvider {...methods}>
          <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
            <FloatingInput
              defaultValue={defaultValue}
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
              {labels} {modelName}
            </Button>
          </form>
        </FormProvider>
      </motion.div>
    </div>,
    document.getElementById("modal")!,
  );
}
