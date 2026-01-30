import Button from "@/components/ui/Button";
import { twMerge } from "tailwind-merge";

type CardProps = { className?: string; img?: string; title: string };

const Card: React.FC<CardProps> = ({ className, img, title }) => {
  return (
    <div className={twMerge(className, "group cursor-pointer")}>
      <div className="mb-6 aspect-[4/5] overflow-hidden">
        <img
          className="transition-tranform h-full w-full object-cover duration-300 group-hover:scale-105"
          src={img}
        />
      </div>
      <div className="flex flex-col items-center text-center">
        <p className="text-oyster mb-3 text-xs tracking-[.3em] uppercase">
          Timeless Elegance
        </p>
        <h3 className="text-mine-shaft mb-6 font-serif text-3xl">{title}</h3>
        <Button className="rounded-none px-8 font-light tracking-[.2em] uppercase">
          Discover
        </Button>

        <div className="bg-oyster mx-auto mt-8 h-[1px] w-0 duration-500 group-hover:w-36" />
      </div>
    </div>
  );
};

export default Card;
