import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import { twMerge } from "tailwind-merge";

type PageButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  children: React.ReactNode;
};

const PageButton: React.FC<PageButtonProps> = ({
  isActive,
  children,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        "hover:text-mine-shaft cursor-pointer duration-300",
        isActive && "text-mine-shaft underline underline-offset-8",
      )}
      {...props}
    >
      {children}
    </button>
  );
};

type PageListProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  qtyPages: number;
  /**
   * Number of visible page buttons (e.g., 7, 9, 11).
   * Odd numbers center the current page better.
   */
  windowSize?: number;
};

const PageList: React.FC<PageListProps> = ({
  currentPage,
  setCurrentPage,
  qtyPages,
  windowSize = 7,
}) => {
  const pages = Array.from({ length: qtyPages }, (_, i) => i + 1);
  let trimmedPages;

  if (qtyPages < windowSize) {
    trimmedPages = pages;
  } else {
    const middle = Math.floor(windowSize / 2);
    const startIndex = Math.max(0, currentPage - middle - 1);

    const endIndex = startIndex + windowSize;
    const endIndexOffset = Math.max(0, endIndex - qtyPages);

    const startIndexOffset = Math.min(0, startIndex - endIndexOffset);

    trimmedPages = pages.slice(startIndexOffset, endIndex);
  }

  return (
    <div className="flex items-center gap-6 font-serif text-lg">
      {trimmedPages.map((pageNum) => (
        <PageButton
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          isActive={currentPage === pageNum}
        >
          {pageNum}
        </PageButton>
      ))}
    </div>
  );
};

const Pagination: React.FC<{ qtyPages: number; windowSize?: number }> = ({
  qtyPages,
  windowSize,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const setCurrentPage = useCallback(
    (page: number) =>
      setSearchParams((prev) => {
        const currentParams = new URLSearchParams(prev);
        currentParams.set("page", `${page}`);
        return currentParams;
      }),
    [setSearchParams],
  );

  const handleChangeCurrentPage = useCallback(
    (newValue: number) => {
      if (newValue < 1 || newValue > qtyPages) return;
      setCurrentPage(newValue);
    },
    [qtyPages, setCurrentPage],
  );

  useEffect(() => {
    if (currentPage < 1) {
      handleChangeCurrentPage(1);
    } else if (currentPage > qtyPages) {
      handleChangeCurrentPage(qtyPages);
    }
  }, [currentPage, qtyPages, handleChangeCurrentPage]);

  const prevNextStyling =
    "flex items-center gap-2 disabled:opacity-40 hover:text-mine-shaft cursor-pointer text-xs group uppercase";

  return (
    <div className="text-mine-shaft/80 mt-12 flex items-center justify-center gap-10">
      <button
        className={prevNextStyling}
        onClick={() => handleChangeCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 duration-300 group-hover:-translate-x-2" />
        <span className="tracking-[0.25em]">Prev</span>
      </button>

      <PageList
        currentPage={currentPage}
        qtyPages={qtyPages}
        setCurrentPage={setCurrentPage}
        windowSize={windowSize}
      />

      <button
        className={prevNextStyling}
        onClick={() => handleChangeCurrentPage(currentPage + 1)}
        disabled={currentPage === qtyPages}
      >
        <span className="tracking-[0.25em]">Next</span>
        <ChevronRight className="h-4 w-4 duration-300 group-hover:translate-x-2" />
      </button>
    </div>
  );
};

export default Pagination;
