import { NavLink, NavLinkProps } from "react-router";
import { twMerge } from "tailwind-merge";

const SidebarLink: React.FC<NavLinkProps> = ({ to, end, children }) => {
  const activeStyling = "bg-oyster/10 text-oyster border-r-oyster border-r-2";
  const inactiveStyling = "hover:bg-oyster/10 hover:text-mine-shaft";

  return (
    <NavLink
      className={({ isActive }) =>
        twMerge(
          `text-mine-shaft/80 flex w-full items-center gap-2 px-6 py-3 text-sm transition-colors duration-300 ${isActive ? activeStyling : inactiveStyling}`,
        )
      }
      to={to}
      end={end}
    >
      {children}
    </NavLink>
  );
};

export default SidebarLink;
