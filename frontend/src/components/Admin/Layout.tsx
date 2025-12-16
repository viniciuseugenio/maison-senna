import { Grid, Home, Layers, Settings, ShoppingBag, Tag } from "lucide-react";
import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useUserContext } from "../../hooks/auth";
import { toast } from "../../utils/customToast";
import SectionHeader from "./SectionHeader";
import SidebarLink from "./SidebarLink";
import { useAuth } from "../../store/useAuth";

const Layout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast.error({
        title: "You cannot access this page",
        description:
          "Please, login first before accessing this part of our website.",
      });
      navigate("/login");
      return;
    }

    if (user && !user.isAdmin) {
      toast.error({
        title: "You cannot access this page",
        description: "This page is meant only for the administration.",
      });
      navigate("/");
    }
  }, [isAuthenticated, user, navigate, isLoading]);

  if (isLoading || !user) {
    return null;
  }

  if (!user.isAdmin) {
    return null;
  }

  return (
    <div className="bg-light flex min-h-screen">
      <div className="border-r-oyster/30 fixed h-full w-64 border-r bg-white">
        <div className="p-6">
          <NavLink
            to="/"
            className="text-mine-shaft flex items-center font-serif text-xl font-light tracking-wider uppercase"
          >
            Maison Senna
          </NavLink>
          <p className="text-mine-shaft/60 mt-1 text-xs">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          <SectionHeader>Main</SectionHeader>
          <SidebarLink to="/admin" end>
            <Home className="h-4 w-4" />
            Dashboard
          </SidebarLink>

          <SectionHeader className="mt-6">Catalog</SectionHeader>
          <SidebarLink to="/admin/products">
            <ShoppingBag className="h-4 w-4" />
            Products
          </SidebarLink>
          <SidebarLink to="/admin/categories">
            <Tag className="h-4 w-4" />
            Categories
          </SidebarLink>

          <SectionHeader className="mt-6">Variations</SectionHeader>
          <SidebarLink to="/admin/variation-kinds">
            <Settings className="h-4 w-4" />
            Variation Kinds
          </SidebarLink>
          <SidebarLink to="/admin/variation-types">
            <Layers className="h-4 w-4" />
            Variation Types
          </SidebarLink>
          <SidebarLink to="/admin/variation-options">
            <Grid className="h-4 w-4" />
            Variation Options
          </SidebarLink>
          <SidebarLink to="/admin/product-variations">
            <Layers className="h-4 w-4" />
            Product Variations
          </SidebarLink>
        </nav>
      </div>
      <div className="ml-64 flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
