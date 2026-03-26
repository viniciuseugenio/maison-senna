import { queryKeys } from "@/api/queryKeys";
import { getVariationKind, updateVariationKind } from "@/api/services";
import { FormModal } from "@/components/features/admin";
import { Button, FloatingInput } from "@/components/ui";
import { toastMessages } from "@/constants/auth";
import { variationKindsSchema } from "@/schemas/variations";
import { VariationKindsForm } from "@/types";
import { toast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Hash, Pen, Tag } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

function VariationKindsEdit() {
  const navigate = useNavigate();
  const { id } = useSearch({ from: "/admin/variation-kinds" });
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        modal: undefined,
        id: undefined,
      }),
    });
  };

  const methods = useForm({
    resolver: zodResolver(variationKindsSchema.partial()),
  });

  const { handleSubmit, setError } = methods;

  const { data: variationKind } = useQuery({
    queryFn: () => getVariationKind(id),
    queryKey: queryKeys.variationKinds.detail(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (variationKind) {
      methods.reset(variationKind);
    }
  }, [variationKind, methods]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateVariationKind,
    onSuccess: () => {
      toast.success({
        title: toastMessages.admin.variationKindUpdated.title,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.variationKinds.all });
      onClose();
    },
    onError: (error) => {
      if (error.errors) {
        const nameError = error.errors.name[0] as string;

        if (error) {
          const errorCapitalized =
            nameError[0].toUpperCase() + nameError.slice(1);
          setError("name", {
            message: errorCapitalized,
          });
          return;
        }
      }
    },
  });

  const onSubmit: SubmitHandler<VariationKindsForm> = async (data) => {
    mutate({ id, data });
  };

  return (
    <FormModal
      title="Edit Variation Kind"
      onClose={onClose}
      isPending={isPending}
    >
      <FormProvider {...methods}>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <FloatingInput
              icon={<Tag className="h-4 w-4" />}
              name="name"
              label="Name"
            />
            <FloatingInput
              icon={<Hash className="h-4 w-4" />}
              name="skuAbbr"
              label="SKU Abbreviation"
            />
          </div>
          <Button
            isLoading={isPending}
            loadingLabel="Creating..."
            className="mt-4 w-full gap-2"
          >
            <Pen className="h-4 w-4" />
            Edit
          </Button>
        </form>
      </FormProvider>
    </FormModal>
  );
}

export default VariationKindsEdit;
