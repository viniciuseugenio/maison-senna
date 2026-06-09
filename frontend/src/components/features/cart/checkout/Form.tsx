import {
  Button,
  CheckboxInput,
  FloatingInput,
  SelectInput,
} from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import StateSelectInput from "./StateSelectInput";

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate({ from: "/checkout" });
  const { watch, reset, trigger } = useFormContext();
  const cep = watch("cep");

  const { data: cepInfo, isFetched } = useQuery({
    queryFn: async () => {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      return await response.json();
    },
    queryKey: ["cepInfo", cep],
    enabled: cep?.length === 8,
  });

  useEffect(() => {
    if (isFetched) {
      const {
        logradouro: street,
        localidade: city,
        bairro: neighborhood,
        uf,
      } = cepInfo;

      reset((prev) => ({
        ...prev,
        street,
        state: uf,
        city,
        neighborhood,
      }));
    }
  }, [isFetched]);

  const fields = [
    "email",
    "fullName",
    "country",
    "cep",
    "street",
    "number",
    "complement",
    "neighborhood",
    "city",
    "state",
  ];

  const handleContinue = async () => {
    const output = await trigger(fields, { shouldFocus: true });
    console.log("output", output);

    if (!output) return;

    navigate({
      search: (prev) => ({ step: prev.step + 1 }),
    });
  };

  return (
    <>
      <h1 className="text-mine-shaft title mb-12 text-4xl">Customer Details</h1>

      <form className="">
        <section>
          <header>
            <div className="flex justify-between">
              <h2 className="title text-xl">Contact Information</h2>
              <p className="text-mine-shaft/70 uppercase">
                Already have an account?{" "}
                <Link
                  className="text-oyster underline-offset-4 hover:underline"
                  to="/login"
                >
                  Log In
                </Link>
              </p>
            </div>
          </header>
          <div className="mt-6">
            <FloatingInput name="email" label="EMAIL ADDRESS" />
          </div>
        </section>

        <section className="mt-20">
          <header>
            <h2 className="title text-xl">Shipping Address</h2>
          </header>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
            <div className="col-span-2">
              <FloatingInput name="fullName" label="FULL NAME" />
            </div>
            <SelectInput
              isOpen={false}
              setIsOpen={() => {}}
              label="COUNTRY/REGION"
              selectedValue="Brazil"
            >
              <SelectInput.Option>Brazil</SelectInput.Option>
            </SelectInput>
            <FloatingInput maxLength={8} name="cep" label="CEP (POSTAL CODE)" />
            <div className="col-span-2">
              <FloatingInput name="street" label="Address/Street" />
            </div>
            <FloatingInput name="number" label="Number" />
            <FloatingInput name="complement" label="Complement (Optional)" />
            <FloatingInput name="neighborhood" label="Bairro (Neighborhood)" />
            <FloatingInput name="city" label="city" />
            <div className="col-span-2">
              <StateSelectInput />
            </div>
          </div>
          <div className="mt-4">
            <CheckboxInput
              label="Save this information for next time"
              name="saveInfo"
            />
          </div>
        </section>

        <Button
          type="button"
          onClick={handleContinue}
          color="brown"
          className="mt-12 px-16 py-8 font-light"
        >
          Continue to Shipping
        </Button>
      </form>
    </>
  );
};

export default CheckoutForm;
