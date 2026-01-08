import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  getVariationKind,
  updateVariationKind,
} from "../../api/endpoints/products";
import { variationKindsSchema } from "../../schemas/variationTypes";
import { VariationKindsForm } from "../../types/forms";
import { toast } from "../../utils/customToast";
import FormModal from "./FormModal";
import { toastMessages } from "../../constants/auth";

const VariationKindsEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id: stringId } = useParams();
  const id = Number(stringId);
  const queryClient = useQueryClient();

  const onClose = () => {
    navigate(-1);
  };

  const methods = useForm({
    resolver: zodResolver(variationKindsSchema.partial()),
  });

  const { setError } = methods;

  const { data: variationKind } = useQuery({
    queryFn: () => getVariationKind(id),
    queryKey: ["variationKinds", id],
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateVariationKind,
    onSuccess: () => {
      toast.success({
        title: toastMessages.admin.variationKindUpdated.title,
      });
      queryClient.invalidateQueries({ queryKey: ["variationKinds"] });
      navigate(-1);
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
      methods={methods}
      defaultValue={variationKind?.name}
      modelName="Variation Kind"
      onSubmit={onSubmit}
      onClose={onClose}
      isPending={isPending}
      isEdit
    />
  );
};

export default VariationKindsEdit;
