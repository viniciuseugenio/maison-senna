import ConnectForm from "../ConnectForm";
import { twMerge } from "tailwind-merge";
import InputError from "../InputError";

const DescriptionInput: React.FC<{ error?: string }> = ({ error }) => {
  return (
    <ConnectForm>
      {({ register }) => (
        <div className="md:col-span-3">
          <div className="text-mine-shaft mb-2 text-sm font-medium">
            Description
          </div>
          <textarea
            className={twMerge(
              `text-mine-shaft flex w-full rounded-md border p-2 text-sm transition-all duration-300 outline-none focus:ring-2`,
              `${error ? "border-red-500 ring-red-200" : "border-oyster/20 focus:border-oyster ring-oyster/30"}`,
            )}
            rows={4}
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
