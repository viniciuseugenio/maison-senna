import HorizontalDivider from "@components/ui/HorizontalDivider";
import { Star } from "lucide-react";
import { FunctionComponent } from "react";
import ProductReviewItem from "./ProductReviewItem";

const ProductReviews: FunctionComponent = () => {
  const reviews = [
    {
      stars: 4,
      name: "Michael P.",
      date: "April 10, 2023",
      content:
        "I proposed with this ring and it exceeded all expectations. The craftsmanship is outstanding and the diamond sparkles brilliantly in any light. My fiancée was speechless.",
    },
    {
      stars: 5,
      name: "Catherine D.",
      date: "March 28, 2023",
      content:
        "This ring is a true work of art. The attention to detail is remarkable, and it sits perfectly on my finger. Worth every penny for such exceptional quality.",
    },
  ];

  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Customer Reviews
        </h2>
        <HorizontalDivider className="mx-auto" />
        <div className="mt-6 flex items-center justify-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-oyster text-oyster" />
            ))}
          </div>
          <span className="text-mine-shaft ml-3 text-lg">5.0 out of 5</span>
        </div>
        <div className="text-mine-shaft/80 mt-2">Based on 2 reviews</div>
      </div>

      <div className="space-y-8">
        {reviews.map((review, i) => (
          <ProductReviewItem key={i} review={review} />
        ))}
      </div>
    </>
  );
};

export default ProductReviews;
