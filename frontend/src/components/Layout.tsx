import { Outlet, useLocation } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen">
        <Navbar />
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
