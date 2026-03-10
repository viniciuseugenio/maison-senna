import { PaginationResults, WishlistItem } from "@/types/catalog";
import { buildApiUrl, customFetch } from "@api/client";
import { CATALOG_ENDPOINTS } from "@api/constants";
import { genericDeleteModel } from "@api/services/products.service";

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
