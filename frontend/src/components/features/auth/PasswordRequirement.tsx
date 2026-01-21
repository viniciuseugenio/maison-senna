import { X, Check } from "lucide-react";

const PasswordRequirement: React.FC<{ label: string; isValid: boolean }> = ({
  label,
  isValid,
}) => {
  const iconStyle = "h-4 w-4 mr-2";
  const iconColor = isValid ? "text-green-800/90" : "text-mine-shaft/90";
  const labelColor = isValid ? "text-mine-shaft/60" : "text-mine-shaft/90";

  return (
    <li className="flex items-center">
      {isValid ? (
        <Check className={`${iconStyle} ${iconColor}`} />
      ) : (
        <X className={iconStyle} />
      )}
      <span className={labelColor}>{label}</span>
    </li>
  );
};

export default PasswordRequirement;
