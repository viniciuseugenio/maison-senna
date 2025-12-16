import { Search, ShoppingBag } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { UiStateType } from "../types/navbar";
import AuthButtons from "./AuthButtons";
import NavbarButton from "./NavbarButton";
import UserDropdown from "./UserDropdown";

const NavbarIcons: React.FC<{
  toggleUI: (key: keyof UiStateType, value: boolean) => void;
}> = ({ toggleUI }) => {
  const { isAuthenticated } = useAuth();

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
