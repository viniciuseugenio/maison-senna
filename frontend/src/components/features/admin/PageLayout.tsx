import { PageLayoutProps } from "@/types/admin";
import HorizontalDivider from "@components/ui/HorizontalDivider";
import { Plus, Search } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import BackButton from "./BackButton";
import PageTitle from "./PageTitle";
import TableHead from "./TableHead";

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  actionLabel,
  actionLink,
  onSearch,
  headers,
  children,
}) => {
  const timeoutRef = useRef<number | undefined>(undefined);

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
      <HorizontalDivider />
      <div className="border-oyster/30 mt-6 h-full w-full rounded-md border bg-white">
        <div className="border-oyster/30 flex items-center justify-between border-b p-6">
          <h2 className="text-mine-shaft font-serif text-xl font-light">
            {title} List
          </h2>
          <Link
            to={actionLink}
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
          <table className="divide-oyster/30 min-w-full table-auto divide-y">
            <thead className="bg-mine-shaft/5">
              <tr>
                {headers.map((header) => (
                  <TableHead
                    key={header.title}
                    title={header.title}
                    isButton={header.isButton}
                    className={header.className}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="divide-oyster/30 divide-y bg-white">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
