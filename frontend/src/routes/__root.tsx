import Layout from "@/components/layout/Layout";
import ToasterWrapper from "@/components/providers/ToasterWrapper";
import { Button } from "@/components/ui";
import { AuthContextType } from "@/store/AuthContext";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { SkeletonTheme } from "react-loading-skeleton";

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: GeneralError,
});

function RootComponent() {
  return (
    <SkeletonTheme baseColor="#D3D3D3" borderRadius={0}>
      <ToasterWrapper>
        <Layout>
          <Outlet />
        </Layout>
      </ToasterWrapper>
    </SkeletonTheme>
  );
}

function NotFound() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-oyster font-serif text-8xl font-light tracking-tight">
            404
          </h1>
          <h2 className="text-mine-shaft mt-6 font-serif text-3xl font-light tracking-wider">
            Page Not Found
          </h2>

          <div className="bg-mine-shaft mx-auto mt-4 h-[1px] w-20" />

          <p className="text-mine-shaft/90 mt-8 text-lg leading-relaxed">
            We couldn't find the page you were looking for. The page may have
            been moved, deleted, or perhaps the URL was mistyped.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => window.history.back()}
              className="min-w-[180px] py-6"
            >
              Go Back
            </Button>
            <Link to="/">
              <Button variant="outline" className="min-w-[180px] py-6">
                Return Home
              </Button>
            </Link>
          </div>

          <div className="border-oyster/40 mt-16 border-t pt-8">
            <h3 className="text-mine-shaft text-lg font-medium">
              Looking for something specific?
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                to="/collections"
                className="border-mine-shaft/30 text-mine-shaft hover:bg-oyster/15 active:bg-oyster/20 block rounded-sm border bg-white p-4 text-center transition-colors ring-inset"
              >
                Browse Collections
              </Link>
              <Link
                to="/"
                className="border-mine-shaft/30 text-mine-shaft hover:bg-oyster/15 active:bg-oyster/20 block rounded-sm border bg-white p-4 text-center transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeneralError() {
  const route = useRouter();

  return (
    <div className="container mx-auto max-w-2xl text-center">
      <div>
        <h1 className="text-mine-shaft mx-auto font-serif text-7xl italic">
          A Moment of Refinement
        </h1>
        <p className="text-mine-shaft/60 mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed font-light tracking-tight">
          It appears there was an issue with your request. Our digital
          experience requires a moment of correction. Please try your action
          again or return to our homepage.
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <Button
          onClick={() => route.invalidate()}
          variant="outline"
          className="px-10 py-8 text-xs tracking-[.3em] uppercase"
        >
          Retry Request
        </Button>
        <Link
          className="text-mine-shaft border-mine-shaft mt-2 grow-0 border-b text-xs tracking-[.3em] uppercase opacity-60"
          to="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
