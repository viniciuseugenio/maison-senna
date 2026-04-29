import { Link } from "@tanstack/react-router";
import { Grid, Home, Layers, Settings, ShoppingBag, Tag } from "lucide-react";
import SectionHeader from "./SectionHeader";
import SidebarLink from "./SidebarLink";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-light flex min-h-screen">
      <aside className="fixed h-full w-64 bg-white">
        <div className="p-6">
          <Link
            to="/"
            className="text-mine-shaft flex items-center font-serif text-xl font-light tracking-wider uppercase"
          >
            Maison Senna
          </Link>
          <p className="text-mine-shaft/60 mt-1 text-xs">Admin Dashboard</p>
        </div>
        <nav className="mt-6">
          <SectionHeader>Main</SectionHeader>
          <ul>
            <SidebarLink to="/admin" exact={true}>
              <Home className="h-4 w-4" />
              Dashboard
            </SidebarLink>
          </ul>

          <SectionHeader className="mt-6">Catalog</SectionHeader>
          <ul>
            <SidebarLink to="/admin/products">
              <ShoppingBag className="h-4 w-4" />
              Products
            </SidebarLink>
            <SidebarLink to="/admin/categories">
              <Tag className="h-4 w-4" />
              Categories
            </SidebarLink>
          </ul>

          <SectionHeader className="mt-6">Variations</SectionHeader>
          <ul>
            <SidebarLink to="/admin/variation-kinds">
              <Settings className="h-4 w-4" />
              Variation Kinds
            </SidebarLink>
            <SidebarLink to="/admin/variation-options">
              <Grid className="h-4 w-4" />
              Variation Options
            </SidebarLink>
            <SidebarLink to="/admin/product-variations">
              <Layers className="h-4 w-4" />
              Product Variations
            </SidebarLink>
          </ul>
        </nav>
      </aside>
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
};

export default Layout;
