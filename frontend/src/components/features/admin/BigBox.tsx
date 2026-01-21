import { BigBoxProps } from "@/types/admin";
import { Link } from "react-router";

const BigBox: React.FC<BigBoxProps> = ({
  to,
  title,
  Icon,
  description,
  data = 0,
}) => {
  return (
    <Link
      to={to}
      className="border-oyster/30 hover:border-oyster rounded-md border bg-white p-6 transition-colors duration-300"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-mine-shaft font-medium">{title}</h2>
        <Icon className="text-oyster h-5 w-5" />
      </div>
      <p className="text-mine-shaft text-3xl font-light">{data}</p>
      <p className="text-mine-shaft/80 mt-2 text-sm">{description}</p>
    </Link>
  );
};

export default BigBox;
