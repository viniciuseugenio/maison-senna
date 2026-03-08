import { Statistics } from "@/types/admin";
import {
  PaginationResults,
  ProductDetails,
  ProductList,
  WishlistItem,
} from "@/types/catalog";
import { buildApiUrl } from "../endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "../endpoints/constants";
import { customFetch } from "../endpoints/customFetch";

export async function getProducts() {
  return await customFetch<PaginationResults<ProductList>>(
    CATALOG_ENDPOINTS.PRODUCTS,
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

export async function getWishlistItems({
  limit,
  page,
}: {
  limit?: number;
  page?: number;
}) {
  const search = new URLSearchParams();

  if (limit != null) search.set("limit", String(limit));
  if (page != null) search.set("page", String(page));

  const query = search.toString();
  const url = `${CATALOG_ENDPOINTS.WISHLIST}${query ? `?${query}` : ""}`;

  return await customFetch<PaginationResults<WishlistItem>>(url, {
    requiresAuth: true,
  });
}

export async function createWishlistItem(productId: number) {
  return await customFetch(CATALOG_ENDPOINTS.WISHLIST, {
    method: "POST",
    body: JSON.stringify({ productId }),
    requiresAuth: true,
  });
}

export async function deleteWishlistItem(id: number) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.WISHLIST_DETAILS, { id });
  return genericDeleteModel(url);
}

export async function deleteWishlistItemByProduct(productId: number) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.WISHLIST_DELETE_BY_PRODUCT, {
    productId,
  });
  return await genericDeleteModel(url);
}
