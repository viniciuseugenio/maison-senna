const { VITE_BACKEND_URL } = import.meta.env;

export const UNEXPECTED_ERROR = "An unexpected error occurred.";

export const AUTH_ENDPOINTS = {
  LOGIN: `${VITE_BACKEND_URL}/token/`,
  REGISTER: `${VITE_BACKEND_URL}/accounts/register/`,
  CHECK_EMAIL_AVAILABITY: `${VITE_BACKEND_URL}/accounts/check-email/`,
  CHECK_USER_AUTHENTICITY: `${VITE_BACKEND_URL}/accounts/me/`,
  REFRESH_ACCESS_TOKEN: `${VITE_BACKEND_URL}/token/refresh/`,
  LOGOUT: `${VITE_BACKEND_URL}/accounts/logout/`,
  GOOGLE_LOGIN: `${VITE_BACKEND_URL}/accounts/auth/google/`,
  REQUEST_PASSWORD_RESET: `${VITE_BACKEND_URL}/accounts/request-password-reset/`,
  RESET_PASSWORD: `${VITE_BACKEND_URL}/accounts/reset-password/`,
};

export const CATALOG_ENDPOINTS = {
  PRODUCTS: `${VITE_BACKEND_URL}/catalog/products/`,
  PRODUCT_DETAILS: `${VITE_BACKEND_URL}/catalog/products/:slug/`,
  LIST_CREATE_CATEGORIES: `${VITE_BACKEND_URL}/catalog/categories/`,
  CATEGORY_DETAILS: `${VITE_BACKEND_URL}/catalog/categories/:id/`,
  ADMIN_METRICS: `${VITE_BACKEND_URL}/catalog/admin/dashboard/metrics/`,
  LIST_CREATE_VARIATION_KINDS: `${VITE_BACKEND_URL}/catalog/variation/kinds/`,
  VARIATION_KINDS_DETAIL: `${VITE_BACKEND_URL}/catalog/variation/kinds/:id/`,
  LIST_VARIATION_TYPES: `${VITE_BACKEND_URL}/catalog/variation/types/`,
  LIST_VARIATION_OPTIONS: `${VITE_BACKEND_URL}/catalog/variation/options/`,
  LIST_PRODUCT_VARIATIONS: `${VITE_BACKEND_URL}/catalog/products_variations/`,
};
