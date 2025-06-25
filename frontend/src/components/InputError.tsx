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
        className={twMerge(`mt-1 text-xs font-medium text-red-600`, className)}
      >
        {children}
      </p>
    )
  );
};

export default InputError;
