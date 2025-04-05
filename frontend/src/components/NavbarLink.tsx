import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

interface NavbarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  className?: string;
  to: string;
}
export default function NavbarLink({
  label,
  to,
  className,
  ...props
}: NavbarLinkProps) {
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
}
