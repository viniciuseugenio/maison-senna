import FeaturedProducts from "@components/features/home/FeaturedProducts";
import Hero from "@components/features/home/Hero";
import ProjectShowcase from "@components/features/home/ProjectShowcase";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ProjectShowcase />
    </>
  );
}
