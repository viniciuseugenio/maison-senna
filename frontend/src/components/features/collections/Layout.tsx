import HorizontalDivider from "@/components/ui/HorizontalDivider";
import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header className="mx-auto max-w-3xl pb-16 text-center">
        <h1 className="text-mine-shaft text-center font-serif text-6xl">
          Our Collections
        </h1>
        <HorizontalDivider className="mx-auto mt-8" />
        <p className="text-mine-shaft/80 mt-8 font-sans text-lg leading-relaxed font-light">
          Discover a curated world of timeless craftsmanship and modern
          sophistication. Each piece is designed to be a lifelong companion,
          embodying the essence of understated luxury.
        </p>
      </header>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 lg:gap-16">{children}</div>
      </div>
    </>
  );
};
export default Layout;
