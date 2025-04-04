import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function Button({
  className,
  children,
  variant = "default",
  size = "default",
  onClick,
  ...props
}: ButtonProps) {
  const variantStyles = {
    outline:
      "bg-transparent text-mine-shaft border-mine-shaft hover:bg-mine-shaft/95 active:bg-mine-shaft hover:text-light border",
    default:
      "bg-mine-shaft/90 hover:bg-mine-shaft/95 active:bg-mine-shaft text-light border-transparent",
  } as const;
  const variantStyle = variantStyles[variant];

  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  } as const;
  const sizeStyle = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      className={twMerge(
        `flex cursor-pointer items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantStyle} ${sizeStyle} ${className}`,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
