import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { twMerge } from "tailwind-merge";

type PageListProps = {
  currentPage: number;
  qtyPages: number;
  /**
   * Number of visible page buttons (e.g., 7, 9, 11).
   * Odd numbers center the current page better.
   */
  windowSize?: number;
};

const PageList: React.FC<PageListProps> = ({
  currentPage,
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
        <Link
          className={twMerge(
            "hover:text-mine-shaft cursor-pointer duration-300",
            currentPage === pageNum &&
              "text-mine-shaft underline underline-offset-8",
          )}
          to="."
          search={(prev) => ({ ...prev, page: pageNum })}
        >
          {pageNum}
        </Link>
      ))}
    </div>
  );
};

const Pagination: React.FC<{
  qtyPages: number;
  marginTop?: string;
  windowSize?: number;
}> = ({ qtyPages, windowSize, marginTop = "mt-12" }) => {
  const { page: currentPage = 1 } = useSearch({ strict: false });

  const prevNextStyling =
    "flex items-center gap-2 disabled:opacity-40 hover:text-mine-shaft cursor-pointer text-xs group uppercase";

  return (
    <div
      className={twMerge(
        "text-mine-shaft/80 flex items-center justify-center gap-10",
        marginTop,
      )}
    >
      <Link
        className={prevNextStyling}
        to="."
        search={(prev) => ({
          ...prev,
          page: prev.page && prev.page > 1 ? prev.page - 1 : 1,
        })}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 duration-300 group-hover:-translate-x-2" />
        <span className="tracking-[0.25em]">Prev</span>
      </Link>

      <PageList
        currentPage={currentPage}
        qtyPages={qtyPages}
        windowSize={windowSize}
      />

      <Link
        to="."
        className={prevNextStyling}
        disabled={currentPage === qtyPages}
        aria-disabled={currentPage === qtyPages}
        search={(prev) => ({
          ...prev,
          page: prev.page && prev.page < qtyPages ? prev.page + 1 : qtyPages,
        })}
      >
        <span className="tracking-[0.25em]">Next</span>
        <ChevronRight className="h-4 w-4 duration-300 group-hover:translate-x-2" />
      </Link>
    </div>
  );
};

export default Pagination;
