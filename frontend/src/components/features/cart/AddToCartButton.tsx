import { queryKeys } from "@/api/queryKeys";
import { sendCartItems } from "@/api/services/cart.service";
import { Button } from "@/components/ui";
import { useProductVariation } from "@/hooks/useProductVariation";
import { toast } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonType {
  variationData: ReturnType<typeof useProductVariation>;
  quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonType> = ({
  variationData,
  quantity,
}) => {
  const queryClient = useQueryClient();
  const { productVariation } = variationData;

  const { mutate } = useMutation({
    mutationFn: () =>
      sendCartItems({
        variationSku: productVariation!.sku,
        quantity,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data.cart);
      toast.success({
        title: data.detail,
        description: data.description,
      });
    },
    onError: (data) => {
      toast.error({
        title: data.detail,
        description: data.description,
      });
    },
  });

  return (
    <Button
      disabled={!variationData.isAvailable}
      size="lg"
      className="flex-1 text-sm uppercase"
      onClick={() => mutate()}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
