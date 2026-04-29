import { Link, LinkComponentProps } from "@tanstack/react-router";

const SidebarLink: React.FC<LinkComponentProps & { exact?: boolean }> = ({
  to,
  children,
  exact = false,
  ...props
}) => {
  return (
    <li>
      <Link
        activeOptions={{ exact: exact }}
        activeProps={{
          className: "bg-oyster/10 text-oyster border-r-oyster border-r-2",
        }}
        className="text-mine-shaft/80 hover:bg-oyster/10 hover:text-mine-shaft flex w-full items-center gap-2 px-6 py-3 text-sm transition-colors duration-300"
        to={to}
        {...props}
      >
        {children}
      </Link>
    </li>
  );
};

export default SidebarLink;
