import { LogOut, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import NavbarButton from "@components/layout/NavbarButton";
import { useAuth } from "@/store/useAuth";

type UserDropdownProps = {
  setLogoutModalOpen: (value: boolean) => void;
};

type UserDropdownItemProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

function UserDropdownItem<T extends React.ElementType = "button">({
  as,
  children,
  className,
  ...props
}: UserDropdownItemProps<T>) {
  const Component = as || "button";
  const styling = twMerge(
    `hover:text-mine-shaft hover:bg-oyster/10 flex cursor-pointer items-center rounded-md p-2 text-left font-medium transition-colors duration-300 ${className}`,
  );

  return (
    <Component className={styling} {...props}>
      {children}
    </Component>
  );
}

const UserDropdown: React.FC<UserDropdownProps> = ({ setLogoutModalOpen }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Unnamed User";
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onSignOut = () => {
    setIsOpen(false);
    setLogoutModalOpen(true);
  };

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <NavbarButton onClick={() => setIsOpen(!isOpen)} icon>
        <User className="h-4 w-4" />
      </NavbarButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 z-50 mt-1 min-w-48 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/5"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="border-b border-b-gray-200 p-3">
              <p className="flex text-sm font-medium">{fullName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="m-1 flex flex-col text-sm text-neutral-600">
              <UserDropdownItem>My Account</UserDropdownItem>
              <UserDropdownItem>My Orders</UserDropdownItem>
              <UserDropdownItem>Wishlist</UserDropdownItem>
              {user?.isAdmin && (
                <UserDropdownItem as={Link} to="/admin">
                  Admin Page
                </UserDropdownItem>
              )}
              <UserDropdownItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </UserDropdownItem>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
