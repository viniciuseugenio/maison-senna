import { Outlet } from "react-router";
import { Toaster } from "sonner";

const ToasterWrapper: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Outlet />
    </>
  );
};

export default ToasterWrapper;
