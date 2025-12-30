import { Statistics } from "../../types/admin";
import {
  Category,
  ProductDetails,
  ProductList,
  ProductVariation,
  VariationKind,
  VariationOptionList,
  VariationTypeList,
} from "../../types/catalog";
import { buildApiUrl } from "./buildApiUrl";
import { CATALOG_ENDPOINTS } from "./constants";
import { customFetch } from "./customFetch";

export async function getProducts() {
  return await customFetch<ProductList[]>(CATALOG_ENDPOINTS.PRODUCTS);
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

export async function genericDeleteModel(endpoint: string) {
  return await customFetch(endpoint, {
    method: "DELETE",
    requiresAuth: true,
  });
}

export async function addCategory(data: { name: string }) {
  return await customFetch<Category>(CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES, {
    body: JSON.stringify(data),
    method: "POST",
    returnBadRequest: true,
    requiresAuth: true,
  });
}

export async function getProduct(slug: string): Promise<ProductDetails> {
  const url = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, { slug });
  return await customFetch<ProductDetails>(url);
}

export async function getCategories() {
  return await customFetch<Category[]>(
    CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES,
  );
}

export async function getDashboardStatistics() {
  return await customFetch<Statistics>(CATALOG_ENDPOINTS.ADMIN_METRICS);
}

export async function getVariationKinds() {
  return await customFetch<VariationKind[]>(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_KINDS,
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

export async function getVariationTypes() {
  return await customFetch<VariationTypeList[]>(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_TYPES,
  );
}

export async function addVariationType(data: {
  kind: number;
  product: number;
}) {
  return await customFetch<VariationTypeList>(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_TYPES,
    {
      body: JSON.stringify(data),
      method: "POST",
      returnBadRequest: true,
      requiresAuth: true,
    },
  );
}

export async function getVariationOptions() {
  return await customFetch<VariationOptionList[]>(
    CATALOG_ENDPOINTS.LIST_VARIATION_OPTIONS,
  );
}

export async function getProductVariations() {
  return await customFetch<ProductVariation[]>(
    CATALOG_ENDPOINTS.LIST_PRODUCT_VARIATIONS,
  );
}
