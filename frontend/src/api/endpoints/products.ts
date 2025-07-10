import { customFetch } from "./customFetch";
import { CATALOG_ENDPOINTS } from "./constants";
import { buildApiUrl } from "./buildApiUrl";
import { ProductDetails } from "../../types/catalog";

export async function listProducts() {
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

export async function editProduct({
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

export async function createCategory(data: { name: string }) {
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

export async function retrieveProduct(slug: string): Promise<ProductDetails> {
  const url = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, { slug });
  return await customFetch(url);
}

export async function listCategories() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_CREATE_CATEGORIES);
}

export async function dashboardStatistics() {
  return await customFetch(CATALOG_ENDPOINTS.ADMIN_METRICS);
}

export async function listVariationKinds() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_VARIATION_KINDS);
}

export async function listVariationTypes() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_VARIATION_TYPES);
}

export async function listVariationOptions() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_VARIATION_OPTIONS);
}

export async function listProductVariations() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_PRODUCT_VARIATIONS);
}
