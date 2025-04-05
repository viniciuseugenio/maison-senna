import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import NavbarButton from "./NavbarButton.tsx";
import NavbarLink from "./NavbarLink.tsx";
import SearchOverlay from "./SearchOverlay.tsx";

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
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/25"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-lg">
            <div className="flex h-full flex-col overflow-y-auto">
              {/* Header with close buttons */}
              <div className="border-oyster/30 flex h-20 items-center justify-between border-b px-4">
                <h2 className="text-mine-shaft text-lg font-medium">Menu</h2>
                <button
                  className="text-mine-shaft/70 hover:text-mine-shaft/85 active:text-mine-shaft cursor-pointer transition-colors"
                  aria-label="Close mobile menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X />
                </button>
              </div>

              {/* Navigation links */}
              <div className="px-4 py-6">
                <ul className="flex flex-col space-y-6">
                  <NavbarLink
                    label="COLLECTIONS"
                    className="text-lg"
                    to="/collections"
                    onClick={closeMobileMenu}
                  />
                  <NavbarLink
                    label="JEWELRY"
                    className="text-lg"
                    to="/jewelry"
                    onClick={closeMobileMenu}
                  />
                  <NavbarLink
                    label="ACCESSORIES"
                    className="text-lg"
                    to="/accessories"
                    onClick={closeMobileMenu}
                  />
                  <NavbarLink label="ABOUT" className="text-lg" to="/about" />
                  <NavbarLink
                    label="CONTACT"
                    className="text-lg"
                    to="/contact"
                    onClick={closeMobileMenu}
                  />
                </ul>

                <div className="border-oyster/30 mt-10 flex flex-col gap-6 border-t pt-6">
                  <NavbarLink
                    label="SIGN IN"
                    className="text-lg"
                    to="/login"
                    onClick={closeMobileMenu}
                  />
                  <NavbarLink
                    label="REGISTER"
                    className="text-lg"
                    to="/register"
                    onClick={closeMobileMenu}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
