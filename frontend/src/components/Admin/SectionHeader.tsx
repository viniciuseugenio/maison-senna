import { twMerge } from "tailwind-merge";
import { SectionHeaderProps } from "../../types/admin";

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={twMerge(`mb-2 px-4 ${className}`)}>
      <p className="text-mine-shaft/60 text-xs font-medium tracking-wider uppercase">
        {children}
      </p>
    </div>
  );
};

export default SectionHeader;
