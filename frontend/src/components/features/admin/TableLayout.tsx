import { HeaderConfig } from "@/types";
import TableHead from "./TableHead";

type TableLayoutProps = {
  headers: HeaderConfig[];
  children: React.ReactNode;
};

const TableLayout: React.FC<TableLayoutProps> = ({ headers, children }) => {
  return (
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
      <tbody className="divide-oyster/30 divide-y bg-white">{children}</tbody>
    </table>
  );
};

export default TableLayout;
