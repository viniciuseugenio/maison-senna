import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { NavbarLinkProps } from "@/types/navbar";

const NavbarLink: React.FC<NavbarLinkProps> = ({
  label,
  to,
  className,
  ...props
}) => {
  return (
    <Link
      to={to}
      className={twMerge(
        `hover:text-oyster text-mine-shaft text-sm font-medium tracking-wide transition-colors ${className}`,
      )}
      {...props}
    >
      {label}
    </Link>
  );
};

export default NavbarLink;
