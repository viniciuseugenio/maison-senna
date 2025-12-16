import { LogOut, Menu } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../store/useAuth.ts";
import { UiStateType } from "../types/navbar";
import MobileNavigation from "./MobileNavigation";
import Modal from "./Modal.tsx";
import NavbarButton from "./NavbarButton";
import NavbarIcons from "./NavbarIcons.tsx";
import NavbarLink from "./NavbarLink.tsx";
import SearchOverlay from "./SearchOverlay";
import ShoppingCart from "./ShoppingCart.tsx";

export default function Navbar() {
  const [uiState, setUiState] = useState<UiStateType>({
    logoutModalOpen: false,
    mobileMenuOpen: false,
    isSearchOpen: false,
    isCartOpen: false,
  });

  const toggleUI = useCallback((key: keyof UiStateType, value: boolean) => {
    setUiState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const { logout } = useAuth();

  const closeMobileMenu = () => {
    toggleUI("mobileMenuOpen", false);
  };

  const confirmLogout = () => {
    logout();
    toggleUI("logoutModalOpen", false);
  };

  const setCartOpen = useCallback(
    (value: boolean) => toggleUI("isCartOpen", value),
    [toggleUI],
  );

  return (
    <>
      <header className="bg-light/80 border-oyster/20 sticky top-0 z-40 h-full border-b backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile button variation */}
            <NavbarButton
              icon
              aria-label="Open menu"
              className="lg:hidden"
              onClick={() =>
                toggleUI("mobileMenuOpen", !uiState.mobileMenuOpen)
              }
            >
              <Menu className="h-4 w-4" />
            </NavbarButton>

            {/* Logo */}
            <div className="flex-1 text-center lg:flex-none lg:text-left">
              <Link to="/">
                <h1 className="font-serif text-2xl tracking-wider">
                  MAISON SENNA
                </h1>
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              <NavbarLink to="/" label="COLLECTIONS" />
              <NavbarLink to="/" label="JEWELRY" />
              <NavbarLink to="/" label="ACCESSORIES" />
              <NavbarLink to="/" label="ABOUT" />
              <NavbarLink to="/" label="CONTACT" />
            </nav>

            {/* Icons  */}
            <NavbarIcons toggleUI={toggleUI} />
          </div>
        </div>
      </header>

      {/* Confirmation modal for logout */}
      <Modal
        title="Sign Out"
        confirmLabel="Sign Out"
        variant="warning"
        isOpen={uiState.logoutModalOpen}
        onClose={() => toggleUI("logoutModalOpen", false)}
        Icon={LogOut}
        onConfirm={confirmLogout}
        description="Are you sure you want to sign out of your account? You will need to sign in again to access your account information."
      />

      {/* Mobile navigation */}
      <AnimatePresence>
        {uiState.mobileMenuOpen && (
          <MobileNavigation closeMenu={closeMobileMenu} />
        )}
      </AnimatePresence>

      <ShoppingCart
        isOpen={uiState.isCartOpen}
        onClose={() => setCartOpen(false)}
      />

      <SearchOverlay
        isOpen={uiState.isSearchOpen}
        onClose={() => toggleUI("isSearchOpen", false)}
      />
    </>
  );
}
