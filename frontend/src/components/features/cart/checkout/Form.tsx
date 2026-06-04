import {
  Button,
  CheckboxInput,
  FloatingInput,
  SelectInput,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import StateSelectInput from "./StateSelectInput";

const checkoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  country: z.string(),
  cep: z.string().regex(/^\d+$/, "Only digits"),
  address: z.string(),
  number: z.number(),
  complement: z.string().optional(),
  state: z.string(),
  city: z.string(),
  saveInfo: z.boolean(),
});

const CheckoutForm: React.FC = () => {
  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
  });
  const { watch, reset } = methods;
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
        logradouro: address,
        localidade: city,
        bairro: neighborhood,
        uf,
      } = cepInfo;

      reset((prev) => ({
        ...prev,
        address,
        state: uf,
        city,
        neighborhood,
      }));
    }
  }, [isFetched]);

  return (
    <>
      <h1 className="title mb-12 text-4xl">Customer Details</h1>

      <FormProvider {...methods}>
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
              <FloatingInput
                maxLength={8}
                name="cep"
                label="CEP (POSTAL CODE)"
              />
              <div className="col-span-2">
                <FloatingInput name="address" label="Address/Street" />
              </div>
              <FloatingInput name="number" label="Number" />
              <FloatingInput name="complement" label="Complement (Optional)" />
              <FloatingInput
                name="neighborhood"
                label="Bairro (Neighborhood)"
              />
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

          <Link
            to="/checkout"
            search={{ step: 1 }}
            className="bg-oyster hover:bg-oyster-600 active:bg-oyster-700 text-light mt-12 inline-block px-16 py-6 text-sm font-light uppercase duration-300"
          >
            Continue to Shipping
          </Link>
        </form>
      </FormProvider>
    </>
  );
};

export default CheckoutForm;
