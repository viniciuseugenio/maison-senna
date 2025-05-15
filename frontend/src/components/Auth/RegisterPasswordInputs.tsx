import { useState } from "react";
import FloatingInputPassword from "./FloatingInputPassword";

type PasswordInputTypes = {
  passwordError?: string;
  confirmPasswordError?: string;
};

export default function RegisterPasswordInputs({
  passwordError,
  confirmPasswordError,
}: PasswordInputTypes) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <FloatingInputPassword
        error={passwordError}
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
      <FloatingInputPassword
        error={confirmPasswordError}
        label="Confirm Password"
        name="confirmPassword"
        showPassword={showPassword}
        togglePassword={togglePassword}
      />
    </>
  );
}
