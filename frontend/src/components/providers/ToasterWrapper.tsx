import { Toaster } from "sonner";

const ToasterWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
};

export default ToasterWrapper;
