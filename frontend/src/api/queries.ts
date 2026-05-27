import { queryOptions } from "@tanstack/react-query";
import { checkUserAuthenticity } from "./services";
import { queryKeys } from "./queryKeys";
import { ServerCart } from "@/types";
import { getUserCart } from "./services/cart.service";

export const userQueryOptions = queryOptions<{
  authenticated: boolean;
  user: any;
}>({
  queryKey: queryKeys.users.current,
  queryFn: checkUserAuthenticity,
  retry: false,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  refetchOnReconnect: "always",
  refetchOnWindowFocus: "always",
});

export const cartQueryOptions = (authIsLoading: boolean) =>
  queryOptions<ServerCart>({
    queryKey: queryKeys.cart,
    queryFn: getUserCart,
    enabled: !authIsLoading,
  });
