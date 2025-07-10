import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { editProduct, retrieveProduct } from "../api/endpoints/products";
import BackButton from "../components/Admin/BackButton";
import HorizontalDivider from "../components/HorizontalDivider";
import ProductForm from "../components/ProductForm";
import newProduct from "../schemas/newProduct";
import { ApiFormError, ApiResponse } from "../types/api";
import { ProductDetails } from "../types/catalog";
import { NewProductForm } from "../types/forms";
import { toast } from "../utils/customToast";
import { getUpdatedFields, partialFormData } from "../utils/products/helpers";
import { isApiFormError } from "../utils/typeGuards";

const EditProduct: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery<ProductDetails>({
    queryFn: () => retrieveProduct(slug as string),
    queryKey: ["products", slug],
  });

  const methods = useForm({
    resolver: zodResolver(newProduct.partial()),
  });
  const { setError } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => editProduct({ data, slug: slug as string }),
    mutationKey: ["products", slug],
    onSuccess: (data: ApiFormError | ApiResponse) => {
      if (isApiFormError(data)) {
        Object.entries(data.errors).forEach(([key, error]) => {
          setError(
            key as keyof NewProductForm,
            {
              message: error[0],
            },
            {
              shouldFocus: true,
            },
          );
        });

        toast.error({
          title: "An error occurred",
          description: "Please, review all fields of the form.",
        });
        return;
      }

      toast.success({
        title: "The product was updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products/");
    },
  });

  const onSubmit: SubmitHandler<NewProductForm> = async (data) => {
    const updatedFields = getUpdatedFields(product!, data);
    if (Object.keys(updatedFields).length === 0) {
      toast.warning({ title: "Nothing was changed." });
      return;
    }

    const formData = partialFormData(updatedFields);
    mutate(formData);
  };

  if (isLoading) {
    return null;
  }

  return (
    <section>
      <BackButton label="Products" link="/admin/products" />
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
            Edit A Product
          </h1>
          <HorizontalDivider />
        </div>

        <ProductForm<Partial<NewProductForm>>
          methods={methods}
          data={product}
          onSubmit={onSubmit}
          isPending={isPending}
          buttonLabel="Edit Product"
        />
      </div>
    </section>
  );
};

export default EditProduct;
