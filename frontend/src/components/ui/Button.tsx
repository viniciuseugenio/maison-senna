import { twMerge } from "tailwind-merge";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  color?: "brown" | "black";
  isLoading?: boolean;
  loadingLabel?: string;
}

export default function Button({
  className,
  children,
  variant = "default",
  size = "default",
  color = "black",
  onClick,
  isLoading,
  loadingLabel = "Loading...",
  ...props
}: ButtonProps) {
  const colorStyles = {
    brown: "bg-[#8b7a6c] duration-300 hover:bg-[#7b6c60] active:bg-[#7b6c60]",
    black: "bg-mine-shaft/90 hover:bg-mine-shaft/95 active:bg-mine-shaft",
  };

  const variantStyles = {
    outline:
      "bg-transparent text-mine-shaft border-mine-shaft hover:bg-mine-shaft/95 active:bg-mine-shaft hover:text-light border",
    default: `${colorStyles[color]} text-light border-transparent`,
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
      disabled={isLoading}
      className={twMerge(
        `flex cursor-pointer items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantStyle} ${sizeStyle} ${className}`,
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  );
}
