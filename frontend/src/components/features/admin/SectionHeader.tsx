import { SectionHeaderProps } from "@/types";
import { twMerge } from "tailwind-merge";

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <h3
      className={twMerge(
        "text-mine-shaft/60 mb-2 px-4 text-xs font-medium tracking-wider uppercase",
        className,
      )}
    >
      {children}
    </h3>
  );
};

export default SectionHeader;
