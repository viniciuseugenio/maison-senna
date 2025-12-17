import { checkEmailAvailability } from "../api/endpoints/auth";
import { z } from "zod";
import { REGISTER_FORM_ERRORS } from "../constants/auth";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(3, REGISTER_FORM_ERRORS.SHORT_FIRST_NAME),
    lastName: z.string().min(3, REGISTER_FORM_ERRORS.SHORT_LAST_NAME),
    email: z
      .string()
      .email(REGISTER_FORM_ERRORS.INVALID_EMAIL)
      .refine(
        async (email) => {
          const data = await checkEmailAvailability(email);
          return data.available;
        },
        {
          message: REGISTER_FORM_ERRORS.EMAIL_UNIQUE,
        },
      ),
    password: z.string().min(8, REGISTER_FORM_ERRORS.SHORT_PASSWORD),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: REGISTER_FORM_ERRORS.BLANK_TERMS }),
    }),
  })
  .refine(
    (data) =>
      (data.firstName === "" && data.lastName === "") ||
      data.firstName.toLowerCase() !== data.lastName.toLowerCase(),
    {
      path: ["lastName"],
      message: REGISTER_FORM_ERRORS.FIRST_LAST_NAME_EQUAL,
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: REGISTER_FORM_ERRORS.PASSWORD_MISMATCH,
  });
