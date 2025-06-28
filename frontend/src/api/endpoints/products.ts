import { customFetch } from "./customFetch";
import { CATALOG_ENDPOINTS } from "./constants";
import { buildApiUrl } from "./buildApiUrl";
import { ProductDetails } from "../../types/catalog";

export async function listProducts() {
  return await customFetch(CATALOG_ENDPOINTS.PRODUCTS);
}

export async function retrieveProduct(slug: string): Promise<ProductDetails> {
  const url = buildApiUrl(CATALOG_ENDPOINTS.RETRIEVE_PRODUCT, { slug });
  return await customFetch(url);
}

export async function listCategories() {
  return await customFetch(CATALOG_ENDPOINTS.LIST_CATEGORIES);
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
