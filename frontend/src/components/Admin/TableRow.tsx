const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tr className="hover:bg-mine-shaft/5 duration-300">{children}</tr>;
};

export default TableRow;
