import {
  createWishlistItem,
  deleteWishlistItemByProduct,
} from "@/api/endpoints/products";
import Button from "@/components/ui/Button";
import { useIsAuthenticated } from "@/hooks/auth";
import { toast } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type WishlistButtonProps = {
  isWishlisted: boolean;
  productId: number;
  productSlug: string;
};

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productSlug,
  productId,
  isWishlisted,
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
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

  const handleWishlistItem = () => {
    if (!isAuthenticated) {
      toast.info({ title: "You have to authenticate yourself first." });
      navigate(`/login?next=/products/${productSlug}`);
      return;
    }
    mutateWishlistItem();
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={wishlistedState ? deleteWishlistItem : handleWishlistItem}
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
