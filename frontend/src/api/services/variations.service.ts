import { buildApiUrl, customFetch } from "@/api/client";
import { CATALOG_ENDPOINTS } from "@/api/constants";
import {
  PaginationResults,
  ProductVariation,
  VariationKind,
  VariationOptionList,
} from "@/types";
import { genericDeleteModel } from "./products.service";

export async function getVariationKinds({ page }: { page: number }) {
  return await customFetch<PaginationResults<VariationKind>>(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_KINDS,
    {
      queryParams: {
        page,
      },
    },
  );
}

export async function getVariationKindsUnpaginated() {
  return await customFetch<VariationKind[]>(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_KINDS,
    {
      queryParams: {
        paginate: false,
      },
    },
  );
}

export async function getVariationKind(id: number) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.VARIATION_KINDS_DETAIL, { id });
  return await customFetch<VariationKind>(url);
}

export async function addVariationKind(data: { name: string }) {
  return await customFetch<VariationKind>(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_KINDS,
    {
      body: JSON.stringify(data),
      method: "POST",
      returnBadRequest: true,
      requiresAuth: true,
    },
  );
}

export async function updateVariationKind({
  id,
  data,
}: {
  id: number;
  data: { name: string };
}) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.VARIATION_KINDS_DETAIL, { id });
  return await customFetch<VariationKind>(url, {
    body: JSON.stringify(data),
    method: "PATCH",
    returnBadRequest: true,
    requiresAuth: true,
  });
}

export async function getVariationOptions({ page }: { page: number }) {
  return await customFetch<PaginationResults<VariationOptionList>>(
    CATALOG_ENDPOINTS.LIST_VARIATION_OPTIONS,
    {
      queryParams: { page },
    },
  );
}

export async function updateVariationOption({
  id,
  name,
  priceModifier,
}: {
  id: number;
  name: string;
  priceModifier: number;
}) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.VARIATION_OPTION_DETAILS, { id });
  return await customFetch<{
    detail: string;
    option: { id: number; name: string; priceModifier?: number };
  }>(url, {
    body: JSON.stringify({ name, priceModifier }),
    method: "PATCH",
    requiresAuth: true,
  });
}

export async function deleteVariationOption(id: number) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.VARIATION_OPTION_DETAILS, { id });
  return await genericDeleteModel<{ detail: string }>(url);
}

export async function getProductVariations({ page }: { page: number }) {
  return await customFetch<PaginationResults<ProductVariation>>(
    CATALOG_ENDPOINTS.LIST_PRODUCT_VARIATIONS,
    {
      queryParams: {
        page,
      },
    },
  );
}
