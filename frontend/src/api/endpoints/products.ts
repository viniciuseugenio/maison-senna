import { CATALOG_ENDPOINTS } from "./constants";
import { customFetch } from "./customFetch";

export async function listProducts() {
  return await customFetch(CATALOG_ENDPOINTS.PRODUCTS);
}
