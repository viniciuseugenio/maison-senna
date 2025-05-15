import { FunctionComponent } from "react";
import { Star } from "lucide-react";

type ProductReviewItemProps = {
  review: { stars: number; name: string; date: string; content: string };
};

const ProductReviewItem: FunctionComponent<ProductReviewItemProps> = ({
  review,
}) => {
  return (
    <div className="rounded-md bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-oyster text-oyster h-4 w-4" />
            ))}
          </div>
          <h3 className="text-mine-shaft ml-3">
            {review.name}
            <span className="ml-2 text-xs text-green-600">
              Verified Purchase
            </span>
          </h3>
        </div>
        <p className="text-mine-shaft/80 text-sm">{review.date}</p>
      </div>
      <div className="text-mine-shaft/80 mt-4">{review.content}</div>
    </div>
  );
};

export default ProductReviewItem;
