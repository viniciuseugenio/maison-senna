import Layout from "@/components/layout/Layout";
import ToasterWrapper from "@/components/providers/ToasterWrapper";
import { AuthContextType } from "@/store/AuthContext";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { SkeletonTheme } from "react-loading-skeleton";

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
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
