import { useState } from "react";
import SpecItemDisplay from "./SpecItemDisplay";
import SpecItemEdit from "./SpecItemEdit";
import { SpecItem } from "./types";

type ProductSpecItemProps = {
  id: string;
  index: number;
  spec: string;
  setSpecs: React.Dispatch<React.SetStateAction<SpecItem[]>>;
};

const ProductSpecItem: React.FC<ProductSpecItemProps> = ({
  id,
  index,
  spec,
  setSpecs,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(spec);

  const onDelete = () => {
    setSpecs((prevSpecs) => prevSpecs.filter((spec) => spec.id !== id));
  };

  const handleSave = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return null;

    setSpecs((prevSpecs) =>
      prevSpecs.map((spec) =>
        spec.id === id ? { ...spec, name: trimmedValue } : spec,
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
