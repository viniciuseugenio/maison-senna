import { userSchema } from "../schemas/userSchema";

export type FormDataTypes = z.infer<typeof userSchema>;

export type FieldErrors = {
  [fieldName: string]: string[];
};
