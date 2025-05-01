import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { CircleAlert, Info, LucideProps, TriangleAlert, X } from "lucide-react";
import Button from "./Button";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

type ModalProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isOpen: boolean;
  variant?: "danger" | "warning" | "info";
  onClose: () => void;
  onConfirm: () => void;
  Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

export default function Modal({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isOpen,
  variant = "info",
  onClose,
  onConfirm,
  Icon,
}: ModalProps) {
  const variantStyles = {
    danger: {
      defaultIcon: TriangleAlert,
      iconColor: "text-red-500",
      confirmButton: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
      accentBorder: "border-l-red-500",
    },
    warning: {
      defaultIcon: CircleAlert,
      iconColor: "text-amber-500",
      confirmButton:
        "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white",
      accentBorder: "border-l-amber-500",
    },
    info: {
      defaultIcon: Info,
      iconColor: "text-oyster",
      confirmButton:
        "bg-oyster/85 hover:bg-oyster/90 active:bg-oyster text-white",
      accentBorder: "border-l-oyster",
    },
  };

  const IconModal = Icon || variantStyles[variant].defaultIcon;

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <motion.div
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className={twMerge(
                  `border-mine-shaft/20 relative w-full max-w-lg border border-l-4 bg-white p-4 shadow-lg ${variantStyles[variant].accentBorder}`,
                )}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 cursor-pointer text-neutral-500 transition-colors duration-300 hover:text-neutral-800 active:text-neutral-950"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <IconModal
                      className={`mt-1 h-5 w-5 ${variantStyles[variant].iconColor}`}
                    />

                    <div className="flex-1">
                      <h3
                        id="modal-title"
                        className="text-mine-shaft font-serif text-xl font-light"
                      >
                        {title}
                      </h3>
                      <p
                        id="modal-description"
                        className="text-mine-shaft/80 mt-2 text-sm"
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3 text-sm font-medium">
                    <Button
                      variant="outline"
                      className="border-mine-shaft/10 hover:bg-mine-shaft/10 hover:text-mine-shaft active:bg-mine-shaft/20"
                      onClick={onClose}
                    >
                      {cancelLabel}
                    </Button>
                    <Button
                      onClick={onConfirm}
                      className={variantStyles[variant].confirmButton}
                    >
                      {confirmLabel}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        modalRoot,
      )}
    </>
  );
}
