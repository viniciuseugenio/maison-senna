import { Category, CategoryWithProducts } from "@/types/catalog";
import { CATALOG_ENDPOINTS } from "../endpoints/constants";
import { customFetch } from "../endpoints/customFetch";
import { buildApiUrl } from "../endpoints/buildApiUrl";

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
