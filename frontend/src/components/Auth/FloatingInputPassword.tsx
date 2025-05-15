import { Eye, EyeOff, Lock } from "lucide-react";
import FloatingInput from "../FloatingInput";

type FloatingInputPasswordProps = {
  label?: string;
  name?: string;
  id?: string;
  error?: string;
  showPassword: boolean;
  togglePassword: () => void;
};

export default function FloatingInputPassword({
  label = "Password",
  name = "password",
  error,
  showPassword,
  togglePassword,
}: FloatingInputPasswordProps) {
  return (
    <div>
      <div className="relative">
        <FloatingInput
          icon={<Lock className="h-4 w-4" />}
          name={name}
          label={label}
          type={showPassword ? "text" : "password"}
          required
          customBorder={error && `border-red-400 `}
        />
        <button
          className="text-mine-shaft/80 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          onClick={togglePassword}
          type="button"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <ul className="mt-1 text-xs font-medium text-red-500">
          <li key={error}>{error}</li>
        </ul>
      )}
    </div>
  );
}
