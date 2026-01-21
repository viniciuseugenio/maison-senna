import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const BackButton: React.FC<{ link?: string; label?: string }> = ({
  link = "/admin",
  label = "Dashboard",
}) => {
  return (
    <Link
      className="border-oyster/30 hover:bg-oyster/15 mb-4 inline-flex cursor-pointer items-center gap-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300"
      to={link}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to {label}
    </Link>
  );
};

export default BackButton;
