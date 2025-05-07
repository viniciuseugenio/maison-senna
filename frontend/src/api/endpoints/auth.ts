import { LoginForm, RegisterForm } from "../../types/auth";
import { API_ENDPOINTS, UNEXPECTED_ERROR } from "./constants";
import { customFetch } from "./customFetch";

export async function loginUser(formData: LoginForm) {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
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

export async function registerUser(formData: RegisterForm) {
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

export async function checkUserAuthenticity() {
  return await customFetch(API_ENDPOINTS.CHECK_USER_AUTHENTICITY);
}

export async function refreshAccessToken() {
  return await customFetch(API_ENDPOINTS.REFRESH_ACCESS_TOKEN, {
    method: "POST",
  }, false);
}

export async function logoutUser() {
  return await customFetch(API_ENDPOINTS.LOGOUT, {
    method: "POST",
  }, false);
}
