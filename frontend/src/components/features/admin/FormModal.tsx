import { HorizontalDivider } from "@/components/ui";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";

type FormModalProps<T> = {
  onClose: () => void;
  isPending: boolean;
  isEdit?: boolean;
  children: React.ReactNode;
  title: string;
  maxWidth?: string;
};

export default function FormModal<T>({
  title,
  onClose,
  isPending,
  children,
  maxWidth = "max-w-lg",
}: FormModalProps<T>) {
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
        className={`border-oyster/70 z-20 w-full rounded-md border bg-white p-6 shadow-lg ${maxWidth}`}
      >
        <div className="flex justify-between">
          <h2 className="text-mine-shaft text-center font-serif text-3xl font-light">
            {title}
          </h2>
          <button
            className="text-mine-shaft/60 top-3 right-3 cursor-pointer duration-300 hover:text-red-600"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close Modal"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>,
    document.getElementById("modal")!,
  );
}
