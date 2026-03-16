import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout as AdminLayout } from "@/components/features/admin";

export const Route = createFileRoute("/admin")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
