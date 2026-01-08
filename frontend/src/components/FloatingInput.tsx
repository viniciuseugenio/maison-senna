import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import ConnectForm from "./ConnectForm";
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
  const isError = !!error;

  const { watch } = useFormContext();
  const fieldValue = watch(name) as string;

  const borderColor = isError
    ? "border-red-500 ring-red-200"
    : "group-focus-within:border-oyster group-focus-within:ring-oyster/30 border-oyster/20 focus-within:border-oyster";

  const hasValueStyle =
    fieldValue || props.defaultValue ? "top-0 text-sm" : "top-1/2";

  return (
    <ConnectForm>
      {({ register }) => (
        <div>
          <div className="group relative">
            <label
              htmlFor=""
              className={`text-mine-shaft/50 group-focus-within:text-mine-shaft/90 pointer-events-none absolute left-8 z-10 -translate-y-1/2 bg-white px-1 text-sm transition-all duration-300 group-focus-within:top-0 ${hasValueStyle}`}
            >
              {label}
            </label>
            <div
              className={twMerge(
                `relative flex h-10 w-full items-center rounded-sm border bg-white transition-colors duration-300 group-focus-within:ring-2 ${borderColor} ${customBorder}`,
              )}
            >
              {icon && (
                <div className="text-oyster/80 absolute top-1/2 left-3 -translate-y-1/2">
                  {icon}
                </div>
              )}
              <input
                {...props}
                {...register(name)}
                name={name}
                type={type}
                className="text-mine-shaft/90 h-full w-full pl-10 text-sm outline-none"
              />
            </div>
          </div>
          <InputError>{error}</InputError>
        </div>
      )}
    </ConnectForm>
  );
};

export default FloatingInput;
