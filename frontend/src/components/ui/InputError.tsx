import { TriangleAlert } from "lucide-react";
import { twMerge } from "tailwind-merge";

type InputErrorProps = {
  children: React.ReactNode;
  className?: string;
};

const InputError: React.FC<InputErrorProps> = ({
  children,
  className = "",
}) => {
  return (
    children && (
      <p
        className={twMerge(
          `mt-1 flex gap-1 text-xs font-medium text-red-600`,
          className,
        )}
      >
        <span>
          <TriangleAlert className="h-4 w-4" />
        </span>
        <span className="tracking-wide">{children}</span>
      </p>
    )
  );
};

export default InputError;
