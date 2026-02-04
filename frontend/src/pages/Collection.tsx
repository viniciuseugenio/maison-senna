import { getCategory } from "@/api/endpoints/products";
import CategoryContent from "@/components/features/collections/CategoryContent";
import CollectionSkeleton from "@/components/features/collections/CollectionSkeleton";
import GeneralError from "@/components/features/collections/GeneralError";
import NotFoundError from "@/components/features/collections/NotFoundError";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const Collection: React.FC = () => {
  const params = useParams();
  const slug = params.slug;
  const navigate = useNavigate();

  const {
    data: category,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: () => getCategory(slug),
    queryKey: ["category", slug],
    enabled: !!slug,
    retry: false,
  });

  useEffect(() => {
    if (!slug) {
      navigate("/collections");
      return;
    }
  }, [slug, navigate]);

  return (
    <section className="from-oyster/10 bg-linear-180 to-transparent py-24">
      {isLoading && <CollectionSkeleton />}

      {isError && error.status === 404 && <NotFoundError />}
      {isError && error.status !== 404 && <GeneralError refetch={refetch} />}

      {!isLoading && !isError && <CategoryContent category={category} />}
    </section>
  );
};

export default Collection;
