import { Link } from "react-router";
import Button from "../components/Button";

export default function NotFound() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-oyster font-serif text-8xl font-light tracking-tight">
            404
          </h1>
          <h2 className="text-mine-shaft mt-6 font-serif text-3xl font-light tracking-wider">
            Page Not Found
          </h2>

          <div className="bg-mine-shaft mx-auto mt-4 h-[1px] w-20" />

          <p className="text-mine-shaft/90 mt-8 text-lg leading-relaxed">
            We couldn't find the page you were looking for. The page may have
            been moved, deleted, or perhaps the URL was mistyped.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => window.history.back()}
              className="min-w-[180px] py-6"
            >
              Go Back
            </Button>
            <Link to="/">
              <Button variant="outline" className="min-w-[180px] py-6">
                Return Home
              </Button>
            </Link>
          </div>

          <div className="border-oyster/40 mt-16 border-t pt-8">
            <h3 className="text-mine-shaft text-lg font-medium">
              Looking for something specific?
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                to="/collections"
                className="border-mine-shaft/30 text-mine-shaft hover:bg-oyster/15 active:bg-oyster/20 block rounded-sm border bg-white p-4 text-center transition-colors ring-inset"
              >
                Browse Collections
              </Link>
              <Link
                to="/"
                className="border-mine-shaft/30 text-mine-shaft hover:bg-oyster/15 active:bg-oyster/20 block rounded-sm border bg-white p-4 text-center transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
