import { ChevronDown, LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import InputError from "./InputError";
import { useFormContext } from "react-hook-form";
import Option from "./Option";

type SelectInputProps = React.FC<{
  label: string;
  Icon: LucideIcon;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (value: React.SetStateAction<boolean>) => void;
  selectedValue?: string;
  error?: string;
}> & {
  Option: typeof Option;
};

const SelectInput: SelectInputProps = ({
  label,
  Icon,
  children,
  isOpen,
  setIsOpen,
  selectedValue,
  error,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const {
    formState: { submitCount },
  } = useFormContext();

  const openOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error, submitCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        ref={inputRef}
        onKeyDown={openOnEnter}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={twMerge(
          `border-oyster/20 focus:border-oyster ring-oyster/30 focus-visible:border-oyster flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-3 text-sm transition-colors duration-300 outline-none focus-visible:ring-2`,
          `${isOpen && "border-oyster ring-2"}`,
          `${error && "border-red-500 ring-red-200"}`,
        )}
      >
        <div className="pointer-events-none flex items-center justify-start gap-2 select-none">
          <Icon className="text-oyster h-4 w-4" />
          <span
            className={twMerge(
              "flex items-center gap-2",
              !selectedValue ? "text-mine-shaft/50" : "text-mine-shaft",
            )}
          >
            {selectedValue ?? label}
          </span>
        </div>
        <motion.span
          style={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          className="transition-all"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </div>
      <InputError>{error}</InputError>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="border-oyster/30 absolute z-10 mt-1 w-full rounded-md border bg-white p-1"
            variants={{
              hidden: { opacity: 0, y: -20 },
            }}
            initial="hidden"
            animate={{ opacity: 1, y: 0 }}
            exit="hidden"
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <ul className="flex flex-col gap-1 text-sm" role="listbox">
              {children}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

SelectInput.Option = Option;

export default SelectInput;
