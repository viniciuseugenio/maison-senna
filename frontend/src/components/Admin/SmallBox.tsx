import { SmallBoxProps } from "../../types/admin";

const SmallBox: React.FC<SmallBoxProps> = ({ Icon, title, data = 0 }) => {
  return (
    <div className="border-oyster/30 flex items-center rounded-md border bg-white p-6">
      <div className="bg-oyster/30 mr-4 rounded-full p-3">
        <Icon className="text-oyster h-6 w-6" />
      </div>
      <div>
        <p className="text-mine-shaft/80 text-sm">{title}</p>
        <p className="text-2xl font-light">{data}</p>
      </div>
    </div>
  );
};

export default SmallBox;
