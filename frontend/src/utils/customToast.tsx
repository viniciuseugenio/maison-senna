import { ToastObjectProps, ToastVariant } from "@/types/customToast";
import CustomToast from "@components/ui/CustomToast";
import { toast as sonnerToast } from "sonner";

const createToast = (variant: ToastVariant = "info") => {
  return ({ title, description, Icon, customId }: ToastObjectProps) => {
    sonnerToast.custom(
      (id) => (
        <CustomToast
          id={id}
          variant={variant}
          title={title}
          description={description}
          Icon={Icon}
        />
      ),
      {
        ...(customId ? { id: customId } : {}),
      },
    );
  };
};

export const toast = {
  success: createToast("success"),
  error: createToast("error"),
  warning: createToast("warning"),
  info: createToast("info"),
};
