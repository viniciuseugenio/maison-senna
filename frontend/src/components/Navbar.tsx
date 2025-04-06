import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import NavbarButton from "./NavbarButton.tsx";
import NavbarLink from "./NavbarLink.tsx";
import SearchOverlay from "./SearchOverlay.tsx";
import { AnimatePresence } from "motion/react";
import MobileNavigation from "./MobileNavigation.tsx";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="bg-light/80 border-oyster/20 sticky top-0 z-40 h-full border-b backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Mobile button variation */}
            <NavbarButton
              icon
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              <NavbarLink label="COLLECTIONS" />
              <NavbarLink label="JEWELRY" />
              <NavbarLink label="ACCESSORIES" />
              <NavbarLink label="ABOUT" />
              <NavbarLink label="CONTACT" />
            </nav>

            {/* Icons  */}
            <div className="flex items-center space-x-4">
              <NavbarButton icon onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </NavbarButton>

              <div className="hidden space-x-3 lg:flex">
                <Link to="/login">
                  <NavbarButton className="px-4 font-medium">
                    Sign In
                    {/* <User className="h-4 w-4" /> */}
                  </NavbarButton>
                </Link>

                <Link to="/register">
                  <NavbarButton className="px-4 font-medium">
                    Register
                  </NavbarButton>
                </Link>
              </div>

              <NavbarButton icon>
                <ShoppingBag className="h-4 w-4" />
              </NavbarButton>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && <MobileNavigation closeMenu={closeMobileMenu} />}
      </AnimatePresence>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
