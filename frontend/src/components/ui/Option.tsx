import { twMerge } from "tailwind-merge";

type OptionProps = React.LiHTMLAttributes<HTMLLIElement> & {
  isSelected: boolean;
};

const Option: React.FC<OptionProps> = ({ isSelected, children, ...props }) => {
  return (
    <li
      {...props}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
      className={twMerge(
        `hover:bg-oyster/10 text-mine-shaft/80 hover:text-mine-shaft focus:bg-oyster/10 focus:text-mine-shaft outline-oyster cursor-pointer rounded-md p-2 transition-colors duration-300 focus-visible:outline-2`,
        `${isSelected && "bg-oyster/10 text-mine-shaft"}`,
      )}
    >
      {children}
    </li>
  );
};

export default Option;
