import { FunctionComponent } from "react";
import { motion } from "motion/react";

type TabContentProps = {
  children: React.ReactNode;
  isActive: boolean;
};

const TabContent: FunctionComponent<TabContentProps> = ({
  children,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <motion.ul
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="text-mine-shaft/80 list-inside list-disc space-y-2 text-sm leading-relaxed"
    >
      {children}
    </motion.ul>
  );
};

export default TabContent;
