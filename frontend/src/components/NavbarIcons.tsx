import { Search, ShoppingBag } from "lucide-react";
import AuthButtons from "./AuthButtons";
import NavbarButton from "./NavbarButton";
import UserDropdown from "./UserDropdown";
import { UiStateType } from "../types/ui";
import { useUserContext } from "../hooks/auth";

const NavbarIcons: React.FC<{
  toggleUI: (key: keyof UiStateType, value: boolean) => void;
}> = ({ toggleUI }) => {
  const { isAuthenticated } = useUserContext();

  return (
    <div className="flex items-center space-x-4">
      <NavbarButton
        icon
        aria-label="Open search"
        onClick={() => toggleUI("isSearchOpen", true)}
      >
        <Search className="h-4 w-4" />
      </NavbarButton>

      {!isAuthenticated ? (
        <AuthButtons />
      ) : (
        <UserDropdown
          setLogoutModalOpen={(value) => toggleUI("logoutModalOpen", value)}
        />
      )}

      <NavbarButton
        aria-label="Open shopping bag"
        onClick={() => toggleUI("isCartOpen", true)}
        icon
      >
        <ShoppingBag className="h-4 w-4" />
      </NavbarButton>
    </div>
  );
};

export default NavbarIcons;
