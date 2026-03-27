import { buildApiUrl, customFetch } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import { Category, CategoryWithProducts, PaginationResults } from "@/types";

export async function addCategory(data: { name: string }) {
  return await customFetch<Category>(CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES, {
    body: JSON.stringify(data),
    method: "POST",
    returnBadRequest: true,
    requiresAuth: true,
  });
}

export async function getCategories({ page }: { page: number }) {
  return await customFetch<PaginationResults<Category>>(
    CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES,
    {
      queryParams: {
        page,
      },
    },
  );
}

export async function getUnpaginatedCategories() {
  return await customFetch<Category[]>(
    CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES,
    {
      queryParams: {
        paginate: false,
      },
    },
  );
}

export async function getCategory(slug: string) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.CATEGORY_DETAILS, { slug });
  return await customFetch<CategoryWithProducts>(`${url}?products=True`);
}
