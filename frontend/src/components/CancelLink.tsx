import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

const CancelLink: React.FC<{
  to: string;
  label?: string;
  className?: string;
}> = ({ to, className, label = "Cancel" }) => {
  return (
    <Link
      to={to}
      className={twMerge(
        `border-mine-shaft/20 hover:bg-mine-shaft/10 cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors duration-300`,
        className,
      )}
    >
      {label}
    </Link>
  );
};

export default CancelLink;
