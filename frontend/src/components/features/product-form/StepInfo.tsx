import { CircleCheckBig, LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

type StepInfoProps = {
  Icon: LucideIcon;
  label: string;
  description: string;
  isLast: boolean;
  onClick?: () => void;
  isCurrentStep: boolean;
  isComplete?: boolean;
};

const StepInfo: React.FC<StepInfoProps> = ({
  Icon,
  label,
  description,
  isLast,
  onClick,
  isCurrentStep,
  isComplete = false,
}) => {
  const DisplayIcon = isComplete ? CircleCheckBig : Icon;

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div
          tabIndex={0}
          role="button"
          onClick={onClick}
          className={twMerge(
            "border-oyster text-oyster inline-block cursor-pointer rounded-full border-2 bg-white p-3 shadow-md transition-all duration-300 hover:shadow-xl",
            !isCurrentStep && "border-oyster/40 text-mine-shaft/50",
            isComplete && "bg-oyster text-white shadow-none",
          )}
        >
          <DisplayIcon className="h-5 w-5" />
        </div>
        <div className="mt-2 text-center transition-all duration-300">
          <p
            className={twMerge(
              "text-mine-shaft text-sm font-medium",
              (isComplete || !isCurrentStep) && "text-mine-shaft/50",
            )}
          >
            {label}
          </p>
          <p className="text-mine-shaft/50 text-xs">{description}</p>
        </div>
      </div>
      {!isLast && <div className="h-0.5 w-16 bg-neutral-300" />}
    </>
  );
};

export default StepInfo;
