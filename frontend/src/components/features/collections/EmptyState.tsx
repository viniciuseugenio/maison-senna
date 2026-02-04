import Button from "@/components/ui/Button";

const EmptyState: React.FC = () => {
  return (
    <div className="mx-auto mt-28 text-center">
      <div>
        <h3 className="font-serif text-3xl italic">
          The Collection is Currently Being Curated
        </h3>
        <p className="text-mine-shaft/60 mx-auto mt-3 max-w-lg text-center text-sm tracking-widest uppercase">
          Our artisans are meticulously preparing the next series of
          masterworks, sign up to be the first to know when they arrive.
        </p>
      </div>
      <form className="border-mine-shaft/40 group focus-within:border-mine-shaft mx-auto mt-12 flex max-w-md justify-between gap-2 border-b duration-300">
        <input
          type="email"
          placeholder="E-mail address"
          className="flex-grow py-3 text-sm tracking-widest uppercase duration-300 outline-none"
        />
        <Button
          className="px-10 text-xs tracking-widest uppercase"
          type="button"
        >
          Notify me
        </Button>
      </form>
    </div>
  );
};

export default EmptyState;
