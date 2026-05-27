import { cartQueryOptions } from "@/api/queries";
import { useAuthUser } from "@/hooks/auth";
import { useQuery } from "@tanstack/react-query";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isFetched } = useAuthUser();
  useQuery(cartQueryOptions(isFetched));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
