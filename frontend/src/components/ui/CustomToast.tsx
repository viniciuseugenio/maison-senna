import {
  AlertCircle,
  CircleCheckBig,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { ToastProps } from "@/types/customToast";

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
      className={`border-mine-shaft/10 relative flex w-full min-w-[25rem] items-start gap-3 rounded-sm border border-l-4 bg-white p-4 shadow-md ${selectedVariation.borderColor}`}
    >
      <button
        className="absolute top-3 right-3 cursor-pointer"
        onClick={() => {
          sonnerToast.dismiss(id);
        }}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="mt-0.5 shrink-0">
        <RendableIcon className={`h-5 w-5 ${selectedVariation.iconColor} `} />
      </div>
      <div className="flex-1">
        <h3 className="text-mine-shaft font-serif text-base tracking-wider">
          {title}
        </h3>
        {description && (
          <p className="text-mine-shaft/60 mt-1 text-sm leading-relaxed">
            {description}
          </p>
        )}
        {/* {buttons && <div className="mt-3">{buttons}</div>} */}
      </div>
    </div>
  );
}
