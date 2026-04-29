import { queryKeys } from "@/api/queryKeys";
import { getDashboardStatistics } from "@/api/services";
import { BigBox, PageTitle, SmallBox } from "@/components/features/admin";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  DollarSign,
  Grid,
  Layers,
  Settings,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

const dashboardQueryOptions = queryOptions({
  queryFn: getDashboardStatistics,
  queryKey: queryKeys.admin.statistics,
});

export const Route = createFileRoute("/admin/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(dashboardQueryOptions);
  },
  component: AdminDashboard,
  pendingComponent: AdminDashboard,
});

function AdminDashboard() {
  const { data: statistics, isLoading } = useQuery(dashboardQueryOptions);

  return (
    <>
      <PageTitle>Admin Dashboard</PageTitle>
      <div className="mt-8 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SmallBox
          Icon={DollarSign}
          title="Total Revenue"
          data={isLoading ? "$0" : "$24,500"}
        />
        <SmallBox
          Icon={ShoppingBag}
          title="Total Orders"
          data={isLoading ? "0" : "156"}
        />
        <SmallBox
          Icon={Users}
          title="Total Customers"
          data={statistics?.totalCustomers ?? 0}
        />
      </div>

      <h2 className="text-mine-shaft mb-4 font-serif text-xl font-light">
        Catalog Management
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BigBox
          to="/admin/products"
          Icon={ShoppingBag}
          data={statistics?.products}
          title="Products"
          description="Manage your products catalog"
        />
        <BigBox
          to="/admin/categories"
          Icon={Tag}
          data={statistics?.categories}
          title="Categories"
          description="Organize your products"
        />
        <BigBox
          to="/admin/variation-kinds"
          Icon={Settings}
          data={statistics?.variationKinds}
          title="Variation Kinds"
          description="Manage variation types (Color, Size, etc...)"
        />
        <BigBox
          to="/admin/variation-options"
          Icon={Grid}
          data={statistics?.variationOptions}
          title="Variation Options"
          description="Manage specific options (Silver, Large, etc.)"
        />
        <BigBox
          to="/admin/product-variations"
          Icon={Layers}
          data={statistics?.productVariations}
          title="Product Variations"
          description="Manage specific product variations with SKUs"
        />
      </div>
    </>
  );
}
