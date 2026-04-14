import { HorizontalDivider, Pagination } from "@/components/ui";
import { HeaderConfig } from "@/types";
import { Link, LinkProps } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useRef } from "react";
import BackButton from "./BackButton";
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
    <div>
      <BackButton />
      <PageTitle>{title}</PageTitle>
      <HorizontalDivider className="mt-4" />
      <div className="border-oyster/30 mt-6 h-full w-full rounded-md border bg-white">
        <div className="border-oyster/30 flex items-center justify-between border-b p-6">
          <h2 className="text-mine-shaft font-serif text-xl font-light">
            {title} List
          </h2>
          <Link
            to={actionLink}
            search={linkSearch}
            className="bg-oyster/90 hover:bg-oyster flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white transition-colors duration-300"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">{actionLabel}</span>
          </Link>
        </div>
        <div>
          <div className="border-b-oyster/30 border-b p-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="text-mine-shaft/50 h-4 w-4" />
              </div>
              <input
                className="ring-oyster/30 focus:ring-oyster/80 w-full rounded-md py-2 pl-10 ring transition duration-300 outline-none focus:ring-2"
                placeholder="Search..."
                onChange={onChange}
              />
            </div>
          </div>
          {type === "flat-list" ? (
            <TableLayout headers={headers}>{children}</TableLayout>
          ) : (
            <>{children}</>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-mine-shaft/60 text-xs tracking-widest uppercase">
          Showing {resultsSize} results out of {dataCount}
        </div>
        <Pagination marginTop="mt-0" qtyPages={qtyPages} />
      </div>
    </div>
  );
};

export default PageLayout;
