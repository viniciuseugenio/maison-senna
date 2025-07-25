import { customFetch } from "./customFetch";
import { CATALOG_ENDPOINTS } from "./constants";
import { buildApiUrl } from "./buildApiUrl";
import { ProductDetails } from "../../types/catalog";

export async function getProducts() {
  return await customFetch(CATALOG_ENDPOINTS.PRODUCTS);
}

export async function createProduct(data: FormData) {
  return await customFetch(
    CATALOG_ENDPOINTS.PRODUCTS,
    {
      body: data,
      method: "POST",
    },
    {
      ignore400Response: true,
    },
  );
}

export async function updateProduct({
  data,
  slug,
}: {
  data: FormData;
  slug: string;
}) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, { slug });
  return await customFetch(
    url,
    {
      body: data,
      method: "PATCH",
    },
    {
      ignore400Response: true,
    },
  );
}

export async function genericDeleteModel(endpoint: string) {
  return await customFetch(
    endpoint,
    {
      method: "DELETE",
    },
    {
      noContent: true,
    },
  );
}

export async function addCategory(data: { name: string }) {
  return await customFetch(
    CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES,
    {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    {
      ignore400Response: true,
    },
  );
}

export async function getProduct(slug: string): Promise<ProductDetails> {
  const url = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, { slug });
  return await customFetch(url);
}

export async function getCategories() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES);
}

export async function getDashboardStatistics() {
  return await customFetch(CATALOG_ENDPOINTS.ADMIN_METRICS);
}

export async function getVariationKinds() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_KINDS);
}

export async function getVariationKind(id: number) {
  const url = buildApiUrl(CATALOG_ENDPOINTS.VARIATION_KINDS_DETAIL, { id });
  return await customFetch(url);
}

export async function addVariationKind(data: { name: string }) {
  return await customFetch(
    CATALOG_ENDPOINTS.LIST_CREATE_VARIATION_KINDS,
    {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    { ignore400Response: true },
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
  return await customFetch(
    url,
    {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    },
    { ignore400Response: true },
  );
}

export async function getVariationTypes() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_VARIATION_TYPES);
}

export async function getVariationOptions() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_VARIATION_OPTIONS);
}

export async function getProductVariations() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_PRODUCT_VARIATIONS);
}
