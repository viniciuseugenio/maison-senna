import { getCategories } from "@/api/endpoints/products";
import Card from "@/components/features/collections/Card";
import CardSkeleton from "@/components/features/collections/CardSkeleton";
import Layout from "@/components/features/collections/Layout";
import SystemInfo from "@/components/features/collections/SystemInfo";
import Button from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const Collections: React.FC = () => {
  const {
    data: collections,
    isLoading,
    isError,
  } = useQuery({
    queryFn: getCategories,
    queryKey: ["categories"],
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <Layout>
          <CardSkeleton />
          <CardSkeleton className="mt-8" />
          <CardSkeleton />
          <CardSkeleton className="mt-8" />
        </Layout>
      );
    }

    if (isError) {
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

    if (!collections || collections.length === 0) {
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
      <Layout>
        {collections.map((collection, i) => (
          <Card
            key={collection.id}
            title={collection.name}
            img={collection.cover}
            slug={collection.slug}
            className={i % 2 === 1 ? "mt-10" : ""}
          />
        ))}
      </Layout>
    );
  };

  return (
    <section className="from-oyster/10 bg-linear-180 to-transparent py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </section>
  );
};
export default Collections;
