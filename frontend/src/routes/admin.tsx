import { Layout as AdminLayout } from "@/components/features/admin";
import { requiredAuthenticated } from "@/lib/route-guards";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: requiredAuthenticated,
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
