import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { getCategories } from "../../api/endpoints/products";
import { Category } from "../../types/catalog";
import { useFormContext } from "react-hook-form";
import InputError from "../InputError";

type CategoryInputProps = {
  value?: Category | null;
  error?: string | null;
};

const CategoryInput: React.FC<CategoryInputProps> = ({ value, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category | null>(value || null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setValue } = useFormContext();

  const { data: categories = [] } = useQuery<Category[]>({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  const handleCategorySelect = useCallback(
    (value: Category) => {
      setCategory(value);
      setValue("category", value.id, { shouldValidate: true });
    },
    [setValue],
  );

  useEffect(() => {
    if (value && !category) {
      handleCategorySelect(value);
    }
  }, [value, setValue, handleCategorySelect, category]);

  const selectCategory = (category: Category) => {
    handleCategorySelect(category);
    setIsOpen(false);
  };

  const openOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const selectOnEnter = (e: React.KeyboardEvent, category: Category) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectCategory(category);
    }
  };

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
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
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
          <Tag className="text-oyster h-4 w-4" />
          <span
            className={twMerge(
              "flex items-center gap-2",
              !category ? "text-mine-shaft/50" : "text-mine-shaft",
            )}
          >
            {category?.name ?? "Select a category..."}
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
              {categories &&
                categories.map((cat) => (
                  <li
                    tabIndex={0}
                    role="button"
                    aria-selected={cat.id === category?.id}
                    onKeyDown={(e) => selectOnEnter(e, cat)}
                    onClick={() => selectCategory(cat)}
                    key={cat.id}
                    className={twMerge(
                      `hover:bg-oyster/10 text-mine-shaft/80 hover:text-mine-shaft focus:bg-oyster/10 focus:text-mine-shaft outline-oyster cursor-pointer rounded-md p-2 transition-colors duration-300 focus-visible:outline-2`,
                      `${cat.id === category?.id && "bg-oyster/10 text-mine-shaft"}`,
                    )}
                  >
                    {cat.name}
                  </li>
                ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryInput;
