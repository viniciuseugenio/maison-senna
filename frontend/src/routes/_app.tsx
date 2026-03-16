import Layout from "@/components/layout/Layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
