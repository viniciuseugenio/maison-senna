import { useState } from "react";
import SpecItemDisplay from "./SpecItemDisplay";
import SpecItemEdit from "./SpecItemEdit";
import { ProductSpecItemProps } from "./types";

const ProductSpecItem: React.FC<ProductSpecItemProps> = ({
  itemIndex,
  spec,
  setSpecs,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(spec);

  const onDelete = () => {
    setSpecs((prevSpecs) => prevSpecs.filter((_, i) => i !== itemIndex));
  };

  const onEdit = () => {
    const newValue = inputValue.trim();
    if (!newValue) return null;

    setSpecs((prevSpecs) =>
      prevSpecs.map((item, i) => (i === itemIndex ? newValue : item)),
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
      index={itemIndex}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
};

export default ProductSpecItem;
