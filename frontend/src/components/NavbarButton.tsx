import { NavbarButtonProps } from "../types/navbar";

/**
 * A reusable button component for the navigation bar that supports both icon-only and regular content modes.
 *
 * It applies consistent styling with hover and active states, rounded corners, and smooth transitions using Tailwind CSS.
 * When used in icon mode (`icon` prop true), it restricts the width to create a square button optimized for icons.
 */
export default function NavbarButton({
  children,
  onClick,
  className,
  icon,
  ...props
}: NavbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`hover:bg-oyster/10 active:bg-oyster/20 flex h-10 cursor-pointer items-center justify-center rounded-md text-sm transition-colors ${icon && "w-10"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
