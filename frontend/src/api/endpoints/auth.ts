import { LoginForm, RegisterForm } from "../../types/auth";
import { AUTH_ENDPOINTS, UNEXPECTED_ERROR } from "./constants";
import { customFetch } from "./customFetch";

export async function loginUser(formData: LoginForm) {
  return await customFetch(AUTH_ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
}

export async function registerUser(formData: RegisterForm) {
  return await customFetch(
    AUTH_ENDPOINTS.REGISTER,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    },
    {
      ignore400Response: true,
    }
  );
}

export async function checkEmailAvailability(email: string) {
  return await customFetch(AUTH_ENDPOINTS.CHECK_EMAIL_AVAILABITY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export async function checkUserAuthenticity() {
  return await customFetch(AUTH_ENDPOINTS.CHECK_USER_AUTHENTICITY);
}

export async function refreshAccessToken() {
  return await customFetch(
    AUTH_ENDPOINTS.REFRESH_ACCESS_TOKEN,
    {
      method: "POST",
    },
  );
}

export async function logoutUser() {
  return await customFetch(
    AUTH_ENDPOINTS.LOGOUT,
    {
      method: "POST",
    },
  );
}

export async function requestPasswordReset(email: string) {
  return await customFetch(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, new_password }),
  });
}
