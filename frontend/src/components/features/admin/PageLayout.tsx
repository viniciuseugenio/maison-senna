import { Pagination } from "@/components/ui";
import { HeaderConfig } from "@/types";
import { Link, LinkProps } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useRef } from "react";
import PageTitle from "./PageTitle";
import TableLayout from "./TableLayout";

type PageLayoutPropsBase = {
  title: string;
  actionLabel: string;
  onSearch: (query: string) => void;
  children: React.ReactNode;
  actionLink: LinkProps["to"];
  linkSearch?: LinkProps["search"];
  qtyPages?: number;
  resultsSize?: number;
  dataCount?: number;
};

interface FlatList extends PageLayoutPropsBase {
  type: "flat-list";
  headers: HeaderConfig[];
}

interface NestedList extends PageLayoutPropsBase {
  type: "nested-list";
}

type PageLayoutProps = FlatList | NestedList;

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  linkSearch,
  actionLabel,
  actionLink,
  onSearch,
  children,
  qtyPages = 1,
  resultsSize,
  dataCount,
  ...props
}) => {
  const timeoutRef = useRef<number | undefined>(undefined);
  const { headers, type = "flat-list" } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(e.target.value);
    }, 500);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <PageTitle>{title}</PageTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="text-mine-shaft/50 h-4 w-4" />
            </div>
            <input
              aria-label="Search input"
              className="bg-mine-shaft/10 h-12 w-full px-4 py-2 pl-10 text-xs tracking-widest uppercase transition duration-300 outline-none"
              placeholder={`Search ${title}...`}
              onChange={onChange}
            />
          </div>
          <Link
            to={actionLink}
            search={linkSearch}
            className="bg-oyster/90 hover:bg-oyster flex h-12 cursor-pointer items-center gap-2 px-10 py-2 text-xs tracking-widest text-white uppercase transition-colors duration-300"
          >
            <span className="text-sm font-medium">{actionLabel}</span>
          </Link>
        </div>
      </div>
      <div className="mt-8 w-full bg-white">
        {type === "flat-list" ? (
          <TableLayout headers={headers}>{children}</TableLayout>
        ) : (
          children
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-mine-shaft/60 text-xs tracking-widest uppercase">
          Showing {resultsSize} results out of {dataCount}
        </div>
        <Pagination marginTop="mt-0" qtyPages={qtyPages} />
      </div>
    </>
  );
};

export default PageLayout;
