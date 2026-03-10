import { buildApiUrl, customFetch } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import { Category, CategoryWithProducts } from "@/types";

export async function addCategory(data: { name: string }) {
  return await customFetch<Category>(CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES, {
    body: JSON.stringify(data),
    method: "POST",
    returnBadRequest: true,
    requiresAuth: true,
  });
}

export async function getCategories() {
  return await customFetch<Category[]>(
    CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES,
  );
}

export async function getCategory(slug: string) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.CATEGORY_DETAILS, { slug });
  return await customFetch<CategoryWithProducts>(`${url}?products=True`);
}
