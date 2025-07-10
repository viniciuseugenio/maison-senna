import { ProductList } from "../../types/catalog";
import TableActions from "./RowActions";
import TableData from "./TableData";
import TableRow from "./TableRow";

const ProductRow: React.FC<{ product: ProductList }> = ({ product }) => {
  return (
    <TableRow>
      <TableData>{product.id}</TableData>
      <TableData>
        <div className="h-10 w-10 overflow-hidden rounded-md">
          <img
            src={product.referenceImage}
            className="h-full w-full object-cover"
          />
        </div>
      </TableData>
      <TableData>{product.name}</TableData>
      <TableData>{product.category.name}</TableData>
      <TableData>{product.basePrice}</TableData>
      <TableData>{product.slug}</TableData>
      <TableActions editLink={`edit/${product.slug}`} deleteLink="/" />
    </TableRow>
  );
};

export default ProductRow;
