import sennaImg from "../../assets/senna.jpg";
import Button from "../Button";

export default function Hero() {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sennaImg})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>
      <div className="relative flex h-full items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-light mb-6 font-serif text-4xl font-light tracking-wider sm:text-5xl md:text-6xl">
              Timeless Elegance
            </h2>
            <p className="mb-10 text-lg font-light text-white/90">
              Discover our curated collection of exquisite pieces designed for
              the modern connoisseur.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button className="bg-light/80 active:bg-light text-mine-shaft hover:bg-light/90 min-w-[180px]">
                SHOP NOW
              </Button>
              <Button
                variant="outline"
                className="border-light text-light hover:bg-light/5 active:bg-light/10 min-w-[180px]"
              >
                DISCOVER
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
