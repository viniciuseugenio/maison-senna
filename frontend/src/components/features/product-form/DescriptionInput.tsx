import ConnectForm from "@/components/shared/ConnectForm";
import { InputError } from "@/components/ui";
import { twMerge } from "tailwind-merge";

const DescriptionInput: React.FC<{ value?: string; error?: string }> = ({
  error,
  value,
}) => {
  return (
    <ConnectForm>
      {({ register }) => (
        <div className="md:col-span-3">
          <div className="text-mine-shaft mb-2 text-sm font-medium">
            Description
          </div>
          <textarea
            className={twMerge(
              "text-mine-shaft flex w-full border-b p-2 text-sm transition-all duration-300 outline-none",
              error ? "border-red-500" : "border-oyster/20 focus:border-oyster",
            )}
            rows={4}
            defaultValue={value}
            {...register("description")}
            placeholder="Enter product description"
          />
          <InputError>{error}</InputError>
        </div>
      )}
    </ConnectForm>
  );
};

export default DescriptionInput;
