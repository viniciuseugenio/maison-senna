import { buildApiUrl, customFetch } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import {
  PaginationResults,
  ProductDetails,
  ProductList,
  Statistics,
} from "@/types";

export async function getProducts({
  limit,
  page,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return await customFetch<PaginationResults<ProductList>>(
    CATALOG_ENDPOINTS.PRODUCTS,
    {
      queryParams: {
        page,
        limit,
        search,
      },
    },
  );
}

export async function searchProduts(query: string) {
  return await customFetch<ProductList[]>(
    `${CATALOG_ENDPOINTS.SEARCH_PRODUCTS}?q=${encodeURIComponent(query)}`,
  );
}

export async function getFeaturedProducts() {
  return await customFetch<ProductList[]>(CATALOG_ENDPOINTS.FEATURED_PRODUCTS);
}

export async function createProduct(data: FormData) {
  return await customFetch<{
    detail: string;
    description: string;
    product: ProductDetails;
  }>(CATALOG_ENDPOINTS.PRODUCTS, {
    body: data,
    method: "POST",
    requiresAuth: true,
  });
}

export async function updateProduct({
  data,
  slug,
}: {
  data: FormData;
  slug: string;
}) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, { slug });
  return await customFetch<{
    detail: string;
    description: string;
    product: ProductDetails;
  }>(url, {
    body: data,
    method: "PATCH",
    requiresAuth: true,
  });
}

export async function genericDeleteModel<T>(endpoint: string) {
  return await customFetch<T>(endpoint, {
    method: "DELETE",
    requiresAuth: true,
  });
}

export async function getProduct(slug: string): Promise<ProductDetails> {
  const url = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, { slug });
  return await customFetch<ProductDetails>(url);
}

export async function getDashboardStatistics() {
  return await customFetch<Statistics>(CATALOG_ENDPOINTS.ADMIN_METRICS);
}
