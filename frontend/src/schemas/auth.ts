import { checkEmailAvailability } from "@/api/endpoints/auth";
import { z } from "zod";
import { registerFormErrors } from "@/constants/auth";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(3, registerFormErrors.shortFirstName),
    lastName: z.string().min(3, registerFormErrors.shortLastName),
    email: z
      .string()
      .email(registerFormErrors.invalidEmail)
      .refine(
        async (email) => {
          const data = await checkEmailAvailability(email);
          return data.available;
        },
        {
          message: registerFormErrors.emailUnique,
        },
      ),
    password: z.string().min(8, registerFormErrors.shortPassword),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: registerFormErrors.blankTerms }),
    }),
  })
  .refine(
    (data) =>
      (data.firstName === "" && data.lastName === "") ||
      data.firstName.toLowerCase() !== data.lastName.toLowerCase(),
    {
      path: ["lastName"],
      message: registerFormErrors.firstLastNameEqual,
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: registerFormErrors.passwordMismatch,
  });
