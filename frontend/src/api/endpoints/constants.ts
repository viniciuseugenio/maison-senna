const { VITE_BACKEND_URL } = import.meta.env;

export const UNEXPECTED_ERROR =
  "An unexpected error occurred. Please try again later.";

export const API_ENDPOINTS = {
  LOGIN: `${VITE_BACKEND_URL}/token/`,
  REGISTER: `${VITE_BACKEND_URL}/accounts/register/`,
  CHECK_EMAIL_AVAILABITY: `${VITE_BACKEND_URL}/accounts/check-email/`,
  CHECK_USER_AUTHENTICITY: `${VITE_BACKEND_URL}/accounts/me/`,
  REFRESH_ACCESS_TOKEN: `${VITE_BACKEND_URL}/token/refresh/`,
  LOGOUT: `${VITE_BACKEND_URL}/accounts/logout/`,
  GOOGLE_LOGIN: `${VITE_BACKEND_URL}/accounts/auth/google/`,
};
