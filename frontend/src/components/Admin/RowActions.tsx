import TableData from "./TableData";
import { Link } from "react-router";

const TableActions: React.FC<{ editLink: string; deleteLink: string }> = ({
  editLink,
  deleteLink,
}) => {
  return (
    <TableData className="text-right">
      <Link
        to={editLink}
        className="text-oyster/80 hover:text-oyster mr-3 font-medium duration-300"
      >
        Edit
      </Link>
      <Link
        to={deleteLink}
        className="font-medium text-red-500 duration-300 hover:text-red-600"
      >
        Delete
      </Link>
    </TableData>
  );
};

export default TableActions;
