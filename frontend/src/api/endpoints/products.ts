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
