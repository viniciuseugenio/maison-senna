import { useEffect, useState } from "react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function FloatingInput({
  label,
  icon,
  error,
  value,
  type,
  onChange,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    props.onFocus?.(e);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    props.onBlur?.(e);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("handleChange floatingInput");
    setHasValue(!!e.target.value);
    onChange?.(e);
  }

  const labelPosition =
    isFocused || hasValue ? "-top-2.5  text-sm" : "top-1/2 -translate-y-1/2";

  return (
    <div className="group relative">
      <label
        htmlFor=""
        className={`text-mine-shaft/50 group-focus-within:text-mine-shaft/90 pointer-events-none absolute left-8 z-10 bg-white px-1 transition-all ${labelPosition}`}
      >
        {label}
      </label>
      <div className="group-focus-within:border-mine-shaft/90 border-oyster/20 focus-within:border-mine-shaft/90 relative flex h-10 w-full items-center rounded-sm border bg-white transition-colors">
        {icon && (
          <div className="text-oyster/80 absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          className="text-mine-shaft/90 h-full w-full pl-10 text-sm outline-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
      </div>
    </div>
  );
}
