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
        className="h-4 w-4 rounded border-oyster/30 text-oyster focus:ring-oyster"
      />
      <label htmlFor={name} className="text-sm text-mine-shaft">
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
