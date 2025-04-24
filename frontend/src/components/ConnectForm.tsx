import { useFormContext, UseFormReturn } from "react-hook-form";

export default function ConnectForm({
  children,
}: {
  children: (methods: UseFormReturn) => React.ReactNode;
}) {
  const methods = useFormContext();

  return children(methods);
}
