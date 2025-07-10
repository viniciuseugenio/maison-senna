import { buildApiUrl } from "../../api/endpoints/buildApiUrl";
import { CATALOG_ENDPOINTS } from "../../api/endpoints/constants";
import { ProductList } from "../../types/catalog";
import TableActions from "./RowActions";
import TableData from "./TableData";
import TableRow from "./TableRow";

const ProductRow: React.FC<{ product: ProductList }> = ({ product }) => {
  const deleteLink = buildApiUrl(CATALOG_ENDPOINTS.PRODUCT_DETAILS, {
    slug: product.slug,
  });

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
      <TableActions
        editLink={`edit/${product.slug}`}
        deleteLink={deleteLink}
        resourceType="Product"
        queryKey={["products"]}
      />
    </TableRow>
  );
};

export default ProductRow;
