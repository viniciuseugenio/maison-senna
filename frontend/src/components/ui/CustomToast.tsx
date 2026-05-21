import {
  AlertCircle,
  CircleCheckBig,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { ToastProps } from "@/types";
import { twMerge } from "tailwind-merge";

export default function CustomToast(props: ToastProps) {
  const { id, title, description, variant, Icon } = props;

  const variations = {
    success: {
      icon: CircleCheckBig,
      iconColor: "text-green-700",
      borderColor: "border-l-green-700",
    },
    error: {
      icon: AlertCircle,
      iconColor: "text-red-600",
      borderColor: "border-l-red-600",
    },
    info: {
      icon: Info,
      iconColor: "text-oyster",
      borderColor: "border-l-oyster",
    },
    warning: {
      icon: TriangleAlert,
      iconColor: "text-amber-500",
      borderColor: "border-l-amber-500",
    },
  };

  const selectedVariation = variations[variant];
  const RendableIcon = Icon ?? selectedVariation.icon;

  return (
    <div
      id="toast-notification"
      className={twMerge(
        "border-mine-shaft/20 flex w-full min-w-[25rem] items-center gap-6 rounded-sm border border-l-4 bg-white p-4 shadow-md shadow-black/30",
        selectedVariation.borderColor,
      )}
    >
      <div>
        <RendableIcon
          className={twMerge("h-5 w-5", selectedVariation.iconColor)}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="text-mine-shaft font-serif text-lg italic">{title}</h3>
        {description && (
          <p className="text-mine-shaft/60 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        className="text-mine-shaft/50 hover:text-mine-shaft cursor-pointer duration-300"
        onClick={() => {
          sonnerToast.dismiss(id);
        }}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
      {/* {buttons && <div className="mt-3">{buttons}</div>} */}
    </div>
  );
}
