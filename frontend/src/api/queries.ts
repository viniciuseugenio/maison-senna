import { queryOptions } from "@tanstack/react-query";
import { checkUserAuthenticity } from "./services";
import { queryKeys } from "./queryKeys";

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
