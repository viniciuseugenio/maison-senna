import { useState } from "react";
import SpecItemDisplay from "./SpecItemDisplay";
import SpecItemEdit from "./SpecItemEdit";
import { SpecItem } from "./types";

type ProductSpecItemProps = {
  idx: string;
  index: number;
  spec: string;
  setSpecs: React.Dispatch<React.SetStateAction<SpecItem[]>>;
};

const ProductSpecItem: React.FC<ProductSpecItemProps> = ({
  idx,
  index,
  spec,
  setSpecs,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(spec);

  const onDelete = () => {
    setSpecs((prevSpecs) => prevSpecs.filter((spec) => spec.idx !== idx));
  };

  const handleSave = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return null;

    setSpecs((prevSpecs) =>
      prevSpecs.map((spec) =>
        spec.idx === idx ? { ...spec, name: trimmedValue } : spec,
      ),
    );

    setIsEditing(false);
  };

  return isEditing ? (
    <SpecItemEdit
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
    />
  ) : (
    <SpecItemDisplay
      spec={spec}
      index={index}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
};

export default ProductSpecItem;
