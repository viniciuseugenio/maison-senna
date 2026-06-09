import ConnectForm from "@/components/shared/ConnectForm";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import InputError from "./InputError";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  icon?: React.ReactNode;
  error?: string;
  customBorder?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  name,
  label,
  icon,
  error,
  type,
  customBorder,
  ...props
}) => {
  const {
    formState: { errors },
  } = useFormContext();
  const formError = error ?? errors[name]?.message;
  const isError = !!formError;

  const { watch } = useFormContext();
  const fieldValue = watch(name, props.defaultValue) as string;

  const hasValueStyle =
    (fieldValue != null && fieldValue !== "") ||
    (props.placeholder != null && props.placeholder !== "")
      ? "top-0 text-xs"
      : "top-1/2";

  return (
    <ConnectForm>
      {({ register }) => (
        <div>
          <div className="group relative">
            <label
              htmlFor=""
              className={twMerge(
                "pointer-events-none absolute z-10 -translate-y-1/2 px-1 text-sm font-light tracking-wider uppercase transition-all duration-300 group-focus-within:top-0 group-focus-within:text-xs",
                hasValueStyle,
                icon && "left-8",
                isError
                  ? "text-red-500 group-focus-within:text-red-600"
                  : "text-mine-shaft/50 group-focus-within:text-oyster",
              )}
            >
              {label}
            </label>
            <div
              className={twMerge(
                "relative flex h-10 w-full items-center border-b transition-colors duration-300",
                isError
                  ? "border-red-300 group-focus-within:border-red-600"
                  : "group-focus-within:border-oyster border-oyster/20 focus-within:border-oyster",
                customBorder,
              )}
            >
              {icon && (
                <div
                  className={twMerge(
                    "absolute top-1/2 left-3 -translate-y-1/2",
                    isError ? "text-red-600" : "text-oyster/80",
                  )}
                >
                  {icon}
                </div>
              )}
              <input
                {...props}
                {...register(name)}
                name={name}
                type={type}
                className={twMerge(
                  "text-mine-shaft/90 h-full w-full text-sm outline-none",
                  props.disabled && "text-mine-shaft/40",
                  icon && "pl-10",
                )}
              />
            </div>
          </div>
          <InputError>{formError}</InputError>
        </div>
      )}
    </ConnectForm>
  );
};

export default FloatingInput;
