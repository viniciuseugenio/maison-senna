import { FormDataTypes } from "../../pages/Register.tsx";
import { API_ENDPOINTS, UNEXPECTED_ERROR } from "./constants";

export async function registerUser(formData: FormDataTypes) {
  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        return { errors: data, status: response.status };
      }
      throw new Error(data.detail);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || UNEXPECTED_ERROR);
    }

    throw new Error(UNEXPECTED_ERROR);
  }
}

export async function checkEmailAvailability(email: string) {
  try {
    const response = await fetch(API_ENDPOINTS.CHECK_EMAIL_AVAILABITY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || UNEXPECTED_ERROR);
    }

    throw new Error(UNEXPECTED_ERROR);
  }
}
