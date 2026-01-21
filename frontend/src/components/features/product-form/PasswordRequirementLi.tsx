import { Check, X } from "lucide-react";

export default function PasswordRequirementLi({
  requirement,
  requirementIsMet,
}: {
  requirement: string;
  requirementIsMet: boolean;
}) {
  return (
    <li className="flex items-center gap-2">
      {requirementIsMet ? (
        <Check className="text-oyster h-4 w-4" />
      ) : (
        <X className="text-mine-shaft/80 h-4 w-4" />
      )}
      <span
        className={`${requirementIsMet ? "text-mine-shaft" : "text-mine-shaft/60"}`}
      >
        {requirement}
      </span>
    </li>
  );
}
