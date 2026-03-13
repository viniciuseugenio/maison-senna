import { getFeaturedProducts } from "@/api/services";
import {
  FeaturedProducts,
  Hero,
  ProjectShowcase,
} from "@/components/features/home";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const featuredPostsQuery = queryOptions({
  queryKey: ["featuredProducts"],
  queryFn: getFeaturedProducts,
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(featuredPostsQuery);
  },
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ProjectShowcase />
    </>
  );
}
