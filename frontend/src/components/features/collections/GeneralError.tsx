import Button from "@/components/ui/Button";
import { RefetchOptions } from "@tanstack/react-query";
import { Link } from "react-router";

type GeneralErrorProps = {
  refetch: any;
};

const GeneralError: React.FC<GeneralErrorProps> = ({ refetch }) => {
  return (
    <div className="container mx-auto max-w-2xl text-center">
      <div>
        <h1 className="text-mine-shaft mx-auto font-serif text-7xl italic">
          A Moment of Refinement
        </h1>
        <p className="text-mine-shaft/60 mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed font-light tracking-tight">
          It appears there was an issue with your request. Our digital
          experience requires a moment of correction. Please try your action
          again or return to our homepage.
        </p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="px-10 py-8 text-xs tracking-[.3em] uppercase"
        >
          Retry Request
        </Button>
        <Link
          className="text-mine-shaft border-mine-shaft mt-2 grow-0 border-b text-xs tracking-[.3em] uppercase opacity-60"
          to="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default GeneralError;
