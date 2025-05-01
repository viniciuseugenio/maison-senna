import { LogOut, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  ButtonHTMLAttributes,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { useUserContext } from "../hooks/auth";
import NavbarButton from "./NavbarButton";

type UserDropdown = {
  setLogoutModalOpen: React.Dispatch<SetStateAction<boolean>>;
};

export function UserDropdownItem({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={twMerge(
        `hover:text-mine-shaft hover:bg-oyster/10 flex cursor-pointer items-center rounded-md p-2 text-left font-medium transition-colors duration-300 ${className}`,
      )}
    >
      {children}
    </button>
  );
}

export default function UserDropdown({ setLogoutModalOpen }: UserDropdown) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { label: "My Account", icon: null, onClick: () => {} },
    { label: "My Order", icon: null, onClick: () => {} },
    { label: "Wishlist", icon: null, onClick: () => {} },
    {
      label: "Sign Out",
      icon: LogOut,
      onClick: () => {
        setIsOpen(false);
        setLogoutModalOpen(true);
      },
    },
  ];

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
              {menuItems.map(({ label, icon: Icon, onClick }) => (
                <UserDropdownItem key={label} onClick={onClick}>
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {label}
                </UserDropdownItem>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
