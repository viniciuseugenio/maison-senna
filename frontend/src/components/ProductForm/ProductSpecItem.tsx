import { useState } from "react";
import SpecItemDisplay from "./SpecItemDisplay";
import SpecItemEdit from "./SpecItemEdit";
import { ProductSpecItemProps } from "./types";

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

  const onEdit = () => {
    const newValue = inputValue.trim();
    if (!newValue) return null;

    setSpecs((prevSpecs) =>
      prevSpecs.map((spec) =>
        spec.id === id ? { ...spec, value: newValue } : spec,
      ),
    );

    setIsEditing(false);
  };

  return isEditing ? (
    <SpecItemEdit
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSave={onEdit}
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
