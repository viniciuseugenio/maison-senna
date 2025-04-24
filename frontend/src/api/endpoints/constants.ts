const { VITE_BACKEND_URL } = import.meta.env;

export const UNEXPECTED_ERROR =
  "An unexpected error occurred. Please try again later.";

export const API_ENDPOINTS = {
  REGISTER: `${VITE_BACKEND_URL}/accounts/register/`,
  CHECK_EMAIL_AVAILABITY: `${VITE_BACKEND_URL}/accounts/check-email/`,
};
