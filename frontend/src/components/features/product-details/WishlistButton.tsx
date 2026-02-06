import {
  createWishlistItem,
  deleteWishlistItemByProduct,
} from "@/api/endpoints/products";
import Button from "@/components/ui/Button";
import { toast } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type WishlistButtonProps = {
  isWishlisted: boolean;
  productId: number;
};

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  isWishlisted,
}) => {
  const [wishlistedState, setWishlistedState] = useState(isWishlisted);
  const queryClient = useQueryClient();

  useEffect(() => {
    setWishlistedState(isWishlisted);
  }, [isWishlisted]);

  const { mutate: mutateWishlistItem } = useMutation({
    mutationKey: ["createWishlistItem"],
    mutationFn: () => createWishlistItem(productId),
    onMutate: () => {
      setWishlistedState(true);
    },
    onSuccess: () => {
      toast.info({
        title: "This product was added to your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast.error({
        title: "There was an error. Please, try again.",
      });
      setWishlistedState(false);
    },
  });

  const { mutate: deleteWishlistItem } = useMutation({
    mutationKey: ["deleteWishlistItem"],
    mutationFn: () => deleteWishlistItemByProduct(productId),
    onMutate: () => setWishlistedState(false),
    onSuccess: () => {
      toast.info({ title: "This product was removed from your wishlist." });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast.error({ title: "There was an error. Please, try again." });
      setWishlistedState(true);
    },
  });

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={wishlistedState ? deleteWishlistItem : mutateWishlistItem}
      className="hover:bg-oyster/10 hover:text-mine-shaft active:bg-oyster/10 border-oyster/20 text-sm uppercase"
    >
      <Heart
        className={`mr-2 h-4 w-4 ${wishlistedState ? "fill-mine-shaft" : "fill-none"}`}
      />
      {wishlistedState ? "Wishlisted" : "Wishlist"}
    </Button>
  );
};

export default WishlistButton;
