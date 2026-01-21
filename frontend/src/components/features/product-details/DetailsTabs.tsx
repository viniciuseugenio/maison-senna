import { motion } from "motion/react";
import { FunctionComponent, useState } from "react";
import TabContent from "./TabContent";

type DetailsTabs = {
  details: string[];
  materials: string[];
  care: string[];
};

const DetailsTabs: FunctionComponent<DetailsTabs> = ({
  details,
  materials,
  care,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Details", "Materials", "Care"];

  return (
    <div className="w-full">
      <div className="bg-oyster/10 grid h-10 w-full grid-cols-3 items-center justify-center rounded-md p-1">
        {tabs.map((tab, index) => (
          <div
            className={`hover:text-mine-shaft relative flex h-full w-full cursor-pointer items-center justify-center uppercase duration-300 ${activeTab === index ? "text-mine-shaft" : "text-mine-shaft/70"}`}
            onClick={() => setActiveTab(index)}
            key={index}
          >
            {index === activeTab && (
              <motion.div
                layoutId="bgHighlight"
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 45,
                  ease: "easeInOut",
                  mass: 1,
                }}
                className="absolute top-1/2 left-0 z-0 h-full w-full -translate-y-1/2 rounded-md bg-white"
              />
            )}
            <span className="z-10 text-sm font-medium">{tab}</span>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <TabContent isActive={activeTab === 0}>
          {details.map((detail: string, i) => (
            <li key={i}>{detail}</li>
          ))}
        </TabContent>
        <TabContent isActive={activeTab === 1}>
          {materials.map((material: string, i) => (
            <li key={i}>{material}</li>
          ))}
        </TabContent>
        <TabContent isActive={activeTab === 2}>
          {care.map((instruction: string, i) => (
            <li key={i}>{instruction}</li>
          ))}
        </TabContent>
      </div>
    </div>
  );
};

export default DetailsTabs;
