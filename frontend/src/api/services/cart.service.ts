import { CartItem, ServerCart } from "@/types";
import { customFetch } from "../client";
import { CATALOG_ENDPOINTS } from "../constants";

export async function getUserCart() {
  return await customFetch<ServerCart>(CATALOG_ENDPOINTS.CART, {
    credentials: "include",
  });
}

export async function sendCartItems(item: CartItem) {
  return await customFetch<{
    detail: string;
    description: string;
    cart: ServerCart;
  }>(CATALOG_ENDPOINTS.CART, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ item }),
  });
}

export async function deleteCartItem(variationSku: string) {
  return await customFetch<{ detail: string; cart: ServerCart }>(
    CATALOG_ENDPOINTS.CART,
    {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ variationSku }),
    },
  );
}

export async function updateCartItem(item: CartItem) {
  return await customFetch<{
    detail: string;
    description: string;
    cart: ServerCart;
  }>(CATALOG_ENDPOINTS.CART, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({
      variationSku: item.variationSku,
      quantity: item.quantity,
    }),
  });
}
