import {
  AlertCircle,
  CircleCheckBig,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";

interface ToastProps {
  id: string | number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  buttons?: React.ReactNode;
  variation: "success" | "error" | "info" | "warning";
}

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      icon={toast.icon}
      variation={toast.variation}
      buttons={toast.buttons}
    />
  ));
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, id, variation, icon, buttons } = props;

  const variations = {
    success: {
      icon: <CircleCheckBig className="h-5 w-5 text-green-600" />,
      borderColor: "border-l-green-600",
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      borderColor: "border-l-red-600",
    },
    info: {
      icon: <Info className="text-oyster h-5 w-5" />,
      borderColor: "border-l-oyster",
    },
    warning: {
      icon: <TriangleAlert className="h-5 w-5 text-amber-500" />,
      borderColor: "border-l-amber-500",
    },
  };
  const selectedVariation = variations[variation];

  return (
    <div
      className={`border-mine-shaft/10 relative flex w-md items-start gap-3 rounded-sm border border-l-4 bg-white p-4 shadow-md ${selectedVariation.borderColor}`}
    >
      <button
        className="absolute top-3 right-3 cursor-pointer"
        aria-label="Close notification"
        onClick={() => {
          sonnerToast.dismiss(id);
        }}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="shrink-0">{icon ?? selectedVariation.icon}</div>
      <div className="flex-1">
        <h3 className="text-mine-shaft font-serif tracking-wider">{title}</h3>
        <p className="text-mine-shaft/60 mt-1 text-sm">{description}</p>
        {buttons && <div className="mt-3">{buttons}</div>}
      </div>
    </div>
  );
}
