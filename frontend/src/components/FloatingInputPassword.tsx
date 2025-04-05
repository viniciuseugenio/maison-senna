import FloatingInput from "./FloatingInput";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FloatingInputPassword({
  label = "Password",
  name = "password",
  id = "password",
  onChange,
}: {
  label?: string;
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <FloatingInput
        icon={<Lock className="h-4 w-4" />}
        name={name}
        id={id}
        label={label}
        type={showPassword ? "text" : "password"}
        onChange={onChange}
      />
      <button
        className="text-mine-shaft/80 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
        type="button"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
