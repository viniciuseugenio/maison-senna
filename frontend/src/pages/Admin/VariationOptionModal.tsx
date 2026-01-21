import { Link, useNavigate } from "react-router";
import FormModal from "../../components/Admin/FormModal";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/endpoints/products";

const VariationOptionModal: React.FC = () => {
  const navigate = useNavigate();
  const closeModalUrl = "/admin/variation-options";
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const onClose = () => {
    navigate(closeModalUrl);
  };

  return (
    <FormModal
      onClose={onClose}
      isPending={false}
      title="Create New Variation Options"
    >
      <div>
        <h2>Select a product:</h2>
        <ul className="text-mine-shaft mt-3 flex flex-col gap-3">
          {products?.map((product) => (
            <li
              key={product.id}
              className="border-mine-shaft/30 hover:bg-mine-shaft/15 cursor-pointer rounded-md border p-3 duration-300 hover:text-black"
            >
              <Link to={`/admin/products/edit/${product.slug}?step=2`}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md">
                    <img
                      src={product.referenceImage}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {product.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </FormModal>
  );
};

export default VariationOptionModal;
