import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
