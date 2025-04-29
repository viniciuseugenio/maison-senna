import FloatingInputPassword from "./FloatingInputPassword";
import { useState } from "react";

export default function LoginPasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FloatingInputPassword
      label="Password"
      name="password"
      showPassword={showPassword}
      togglePassword={togglePassword}
    />
  );
}
