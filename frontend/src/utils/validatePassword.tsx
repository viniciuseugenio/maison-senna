export function validatePassword(
  password: string,
  confirmPassword: string,
): {
  hasMinLength: boolean;
  hasUpperCharacter: boolean;
  hasLowerCharacter: boolean;
  hasNumber: boolean;
  hasSpecialCharacter: boolean;
  passwordsMatch: boolean;
} {
  return {
    hasMinLength: password.length >= 8,
    hasUpperCharacter: /[A-Z]/.test(password),
    hasLowerCharacter: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialCharacter: /[^a-zA-Z0-9]/.test(password),
    passwordsMatch:
      password === confirmPassword && password !== "" && confirmPassword !== "",
  };
}
