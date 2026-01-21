import { motion } from "motion/react";
import NavbarLink from "./NavbarLink.tsx";
import { X } from "lucide-react";

export default function MobileNavigation({
  closeMenu,
}: {
  closeMenu: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/25"
        onClick={closeMenu}
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0" }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          duration: 0.4,
          bounce: 0,
          ease: "easeOut",
        }}
        className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-lg"
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header with close buttons */}
          <div className="border-oyster/30 flex h-20 items-center justify-between border-b px-4">
            <h2 className="text-mine-shaft text-lg font-medium">Menu</h2>
            <button
              className="text-mine-shaft/70 hover:bg-mine-shaft/10 hover:text-mine-shaft/85 active:text-mine-shaft cursor-pointer rounded-full p-2 transition-colors"
              aria-label="Close mobile menu"
              onClick={closeMenu}
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
                onClick={closeMenu}
              />
              <NavbarLink
                label="JEWELRY"
                className="text-lg"
                to="/jewelry"
                onClick={closeMenu}
              />
              <NavbarLink
                label="ACCESSORIES"
                className="text-lg"
                to="/accessories"
                onClick={closeMenu}
              />
              <NavbarLink label="ABOUT" className="text-lg" to="/about" />
              <NavbarLink
                label="CONTACT"
                className="text-lg"
                to="/contact"
                onClick={closeMenu}
              />
            </ul>

            <div className="border-oyster/30 mt-10 flex flex-col gap-6 border-t pt-6">
              <NavbarLink
                label="SIGN IN"
                className="text-lg"
                to="/login"
                onClick={closeMenu}
              />
              <NavbarLink
                label="REGISTER"
                className="text-lg"
                to="/register"
                onClick={closeMenu}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
