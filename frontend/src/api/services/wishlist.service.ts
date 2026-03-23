import { buildApiUrl, customFetch } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import { genericDeleteModel } from "@/api/services/products.service";
import { PaginationResults, WishlistItem } from "@/types";

export async function getWishlistItems({
  max_results,
  page,
}: {
  max_results?: number;
  page?: number;
}) {
  return await customFetch<PaginationResults<WishlistItem>>(
    CATALOG_ENDPOINTS.WISHLIST,
    {
      requiresAuth: true,
      queryParams: {
        max_results,
        page,
      },
    },
  );
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
