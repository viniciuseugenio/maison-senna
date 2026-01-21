import { Outlet } from "react-router";

export default function AuthPageLayout() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="border-oyster/20 rounded-sm border bg-white p-8 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}
