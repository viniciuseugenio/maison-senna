import { HeaderConfig } from "@/types";
import TableHead from "./TableHead";

type TableLayoutProps = {
  headers: HeaderConfig[];
  children: React.ReactNode;
};

const TableLayout: React.FC<TableLayoutProps> = ({ headers, children }) => {
  return (
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-light [&_th]:pb-4">
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
      <tbody className="divide-oyster/15 divide-y [&>tr>td]:py-8">
        {children}
      </tbody>
    </table>
  );
};

export default TableLayout;
