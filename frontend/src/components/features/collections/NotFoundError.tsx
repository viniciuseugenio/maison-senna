import { Link } from "react-router";

const NotFoundError: React.FC = () => {
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-mine-shaft font-serif text-7xl italic">
        A Unique Pursuit
      </h1>
      <p className="text-mine-shaft/60 mx-auto mt-6 max-w-lg text-center text-lg leading-relaxed font-light tracking-tight">
        We couldn't find a collection matching your request. Perhaps another of
        our curated masterworks will capture your attention.
      </p>
      <Link
        to="/collections"
        className="border-mine-shaft text-mine-shaft hover:text-light hover:bg-mine-shaft mt-12 inline-block border px-10 py-6 text-xs tracking-[.3em] uppercase duration-300"
      >
        Explore all collections
      </Link>
    </div>
  );
};

export default NotFoundError;
