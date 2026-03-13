import { getCategory } from "@/api/services";
import {
  CategoryContent,
  CollectionSkeleton,
} from "@/components/features/collections";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const collectionQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["categories", slug],
    queryFn: () => getCategory(slug),
  });

export const Route = createFileRoute("/collections_/$slug")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.ensureQueryData(collectionQueryOptions(params.slug));
  },
  component: Collection,
  pendingComponent: CollectionSkeleton,
});

function Collection() {
  const { slug } = Route.useParams();

  const { data: category } = useSuspenseQuery(collectionQueryOptions(slug));

  return (
    <section className="from-oyster/10 bg-linear-180 to-transparent py-24">
      <CategoryContent category={category} />
    </section>
  );
}

export default Collection;
