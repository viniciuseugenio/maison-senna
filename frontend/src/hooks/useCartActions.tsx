import { queryKeys } from "@/api/queryKeys";
import { deleteCartItem, updateCartItem } from "@/api/services/cart.service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "@/utils/customToast";
import { ServerCartItem } from "@/types";

export const useCartActions = (item: ServerCartItem) => {
  const queryClient = useQueryClient();

  const { mutate: deleteItem } = useMutation({
    mutationFn: () => deleteCartItem(item.variationSku),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data.cart);
      toast.info({ title: data.detail });
    },
  });

  const { mutate: updateItem } = useMutation({
    mutationFn: (type: "increase" | "decrease") =>
      updateCartItem({
        variationSku: item.variationSku,
        quantity: type === "increase" ? item.quantity + 1 : item.quantity - 1,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data.cart);
      toast.info({ title: data.detail });
    },
    onError: (data) => {
      toast.error({ title: data.detail, description: data.description });
    },
  });

  return {
    deleteItem,
    updateItem,
  };
};
