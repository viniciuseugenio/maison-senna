import { LoginForm, RegisterForm } from "../../types/auth";
import { AUTH_ENDPOINTS } from "./constants";
import { customFetch } from "./customFetch";

export async function loginUser(data: LoginForm) {
  return await customFetch<{ detail: string; description: string; user: any }>(
    AUTH_ENDPOINTS.LOGIN,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function registerUser(formData: RegisterForm) {
  return await customFetch<{ detail: string; description: string }>(
    AUTH_ENDPOINTS.REGISTER,
    {
      method: "POST",
      body: JSON.stringify(formData),
      returnBadRequest: true,
    },
  );
}

export async function checkEmailAvailability(email: string) {
  return await customFetch(AUTH_ENDPOINTS.CHECK_EMAIL_AVAILABITY, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function checkUserAuthenticity() {
  return await customFetch<{ authenticated: boolean; user: any }>(
    AUTH_ENDPOINTS.CHECK_USER_AUTHENTICITY,
    {
      requiresAuth: true,
    },
  );
}

export async function refreshAccessToken() {
  return await customFetch(AUTH_ENDPOINTS.REFRESH_ACCESS_TOKEN, {
    method: "POST",
  });
}

export async function logoutUser() {
  return await customFetch<{ detail: string; description: string }>(
    AUTH_ENDPOINTS.LOGOUT,
    {
      method: "POST",
    },
  );
}

export async function requestPasswordReset(email: string) {
  return await customFetch<{ detail: string; description: string }>(
    AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET,
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

export async function resetPassword({
  uid,
  token,
  new_password,
}: {
  uid: string;
  token: string;
  new_password: string;
}) {
  return await customFetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
    method: "POST",
    body: JSON.stringify({ uid, token, new_password }),
  });
}
