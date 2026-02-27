import { twMerge } from "tailwind-merge";

const HorizontalDivider: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={twMerge("bg-oyster h-[1px] w-20", className)} />;
};

export default HorizontalDivider;
