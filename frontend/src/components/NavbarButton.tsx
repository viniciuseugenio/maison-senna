interface NavbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: boolean;
}

export default function NavbarButton({
  children,
  onClick,
  className,
  icon,
}: NavbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`hover:bg-oyster/10 active:bg-oyster/20 flex h-10 cursor-pointer items-center justify-center rounded-md text-sm transition-colors ${icon && "w-10"} ${className}`}
    >
      {children}
    </button>
  );
}
