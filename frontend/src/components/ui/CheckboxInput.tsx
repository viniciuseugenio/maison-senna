import { useFormContext } from "react-hook-form";

type CheckboxInputProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  defaultChecked,
}) => {
  const { register } = useFormContext();

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={name}
        defaultChecked={defaultChecked}
        {...register(name)}
        className="border-oyster/30 text-oyster focus:ring-oyster h-4 w-4 rounded"
      />
      <label
        htmlFor={name}
        className="text-mine-shaft/80 text-xs font-light tracking-wide uppercase"
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
