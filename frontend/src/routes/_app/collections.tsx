import { PAGE_SIZE } from "@/api/constants";
import { queryKeys } from "@/api/queryKeys";
import { getCategories } from "@/api/services";
import {
  Card,
  CardSkeleton,
  Layout,
  SystemInfo,
} from "@/components/features/collections";
import { Button, Pagination } from "@/components/ui";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Suspense } from "react";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().catch(1),
});

const collectionsQueryOptions = (page: number) =>
  queryOptions({
    queryKey: queryKeys.categories.all,
    queryFn: () => getCategories({ page }),
  });

export const Route = createFileRoute("/_app/collections")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ context, deps: { page } }) => {
    context.queryClient.ensureQueryData(collectionsQueryOptions(page));
  },
  component: Collections,
  errorComponent: ErrorComponent,
});

function Collections() {
  return (
    <section className="from-oyster/10 bg-linear-180 to-transparent py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Layout>
          <Suspense fallback={<LoadingComponent />}>
            <CollectionsComponent />
          </Suspense>
        </Layout>
      </div>
    </section>
  );
}

function CollectionsComponent() {
  const { page } = Route.useSearch();
  const {
    data: { results, count },
  } = useSuspenseQuery(collectionsQueryOptions(page));
  const qtyPages = Math.ceil(count / PAGE_SIZE);

  if (!results || results.length === 0) {
    return (
      <SystemInfo
        messageCategory="Coming Soon"
        title="A New Chapter Awaits"
        description="Our artisans are currently crafting new collections. Please return soon to discover our latest masterworks."
      >
        <div className="flex items-center">
          <Link
            to="/"
            className="bg-mine-shaft hover:bg-mine-shaft/95 text-light mx-auto px-14 py-4 text-sm font-light tracking-widest uppercase duration-300"
          >
            Return to Homepage
          </Link>
        </div>
      </SystemInfo>
    );
  }

  return (
    <>
      {results.map((collection, i) => (
        <Card
          key={collection.id}
          title={collection.name}
          img={collection.cover}
          slug={collection.slug}
          className={i % 2 === 1 ? "mt-10" : ""}
        />
      ))}
      <div className="col-span-2">
        <Pagination qtyPages={qtyPages} />
      </div>
    </>
  );
}

function ErrorComponent() {
  return (
    <SystemInfo
      messageCategory="System Notice"
      title="A Brief Interruption"
      description="We are currently experiencing a brief technical moment as we refine our digital experience. Please refresh the page or return shortly to explore our collections."
    >
      <div className="mx-auto flex items-center justify-center gap-6">
        <Button
          onClick={() => window.location.reload()}
          className="px-14 py-7 text-sm font-light tracking-widest uppercase"
        >
          Refresh Page
        </Button>
        <Link
          to="/"
          className="border-mine-shaft/40 hover:bg-mine-shaft hover:text-light text-mine-shaft flex h-10 items-center justify-center border px-14 py-7 text-sm font-light tracking-widest uppercase duration-300"
        >
          Return to Homepage
        </Link>
      </div>
    </SystemInfo>
  );
}

function LoadingComponent() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton className="mt-8" />
      <CardSkeleton />
      <CardSkeleton className="mt-8" />
    </>
  );
}
