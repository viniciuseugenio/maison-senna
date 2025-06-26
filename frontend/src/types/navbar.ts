export type NavbarLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  className?: string;
  to: string;
};

export type UiStateType = {
  logoutModalOpen: boolean;
  mobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
};

export type NavbarButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    icon?: boolean;
  };
