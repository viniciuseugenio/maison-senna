import { queryKeys } from "@/api/queryKeys";
import { AuthButtons } from "@/components/features/auth";
import UserDropdown from "@/components/user/UserDropdown";
import { useAuth } from "@/store/useAuth";
import { ServerCart, UiStateType } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Search, ShoppingBag } from "lucide-react";
import WishlistDropdown from "../features/collections/wishlist/WishlistDropdown";
import NavbarButton from "./NavbarButton";

const NavbarIcons: React.FC<{
  toggleUI: (key: keyof UiStateType, value: boolean) => void;
}> = ({ toggleUI }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const cart: ServerCart = queryClient.getQueryData(queryKeys.cart);
  const totalQty =
    cart?.items?.reduce((acc, item) => item.quantity + acc, 0) ?? 0;

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
        <>
          <UserDropdown
            setLogoutModalOpen={(value) => toggleUI("logoutModalOpen", value)}
          />
          <WishlistDropdown />
        </>
      )}

      <NavbarButton
        aria-label="Open shopping bag"
        onClick={() => toggleUI("isCartOpen", true)}
        icon
        className="relative"
      >
        {totalQty >= 1 && (
          <span className="bg-oyster absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
            {totalQty}
          </span>
        )}
        <ShoppingBag className="h-4 w-4" />
      </NavbarButton>
    </div>
  );
};

export default NavbarIcons;
