import { cartQueryOptions } from "@/api/queries";
import CheckoutForm from "@/components/features/cart/checkout/Form";
import PaymentStep from "@/components/features/cart/checkout/PaymentStep";
import ShippingStep from "@/components/features/cart/checkout/ShippingStep";
import { HorizontalDivider } from "@/components/ui";
import { useAuthUser } from "@/hooks/auth";
import { formatPrice } from "@/utils/formatPrice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Dot } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

const searchSchema = z.object({
  step: z.number().default(0),
});

export const Route = createFileRoute("/_app/checkout")({
  validateSearch: zodValidator(searchSchema),
  component: Checkout,
});

const baseCheckoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1, "Your name is required."),
  country: z.string(),
  cep: z
    .string()
    .regex(/^\d{8}$/, "This CEP is not valid.")
    .min(8, "Your cep is required."),
  street: z.string().min(1, "The street is required."),
  number: z.string().min(1, "The number of your house is required.").max(20),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "The neighborhood is required."),
  city: z.string().min(1, "The city is required."),
  state: z.string().max(2).min(1, "The state is required."),
  shippingId: z.number({
    required_error: "You must choose a method of shipping.",
  }),
  paymentMethod: z.enum(["pix", "credit-card", "bank-slip"], {
    required_error: "You must choose a payment method.",
  }),
});

const pixSchema = baseCheckoutSchema.extend({
  paymentMethod: z.literal("pix"),
});

const bankSlipSchema = baseCheckoutSchema.extend({
  paymentMethod: z.literal("bank-slip"),
});

const creditCardSchema = baseCheckoutSchema.extend({
  paymentMethod: z.literal("credit-card"),
  cardNumber: z
    .string()
    .trim()
    .min(1, "Card number is required")
    .regex(/^\d{13,19}$/, "Card number is not valid"),
  cardHolder: z.string().trim().min(1, "Card holder name is required"),
  expiryDate: z
    .string()
    .max(5)
    .trim()
    .regex(/^(0[1-9]|1[0-2])$/, "Invalid expiry date."),
  cvv: z
    .string()
    .trim()
    .regex(/^d{3,4}$/, "Invalid CVV"),
  intallments: z.number().int().min(1, "Choose the number of installments"),
});

const checkoutFormSchema = z.discriminatedUnion("paymentMethod", [
  pixSchema,
  bankSlipSchema,
  creditCardSchema,
]);

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

function Checkout() {
  const { isFetched } = useAuthUser();
  const { data: cart } = useQuery(cartQueryOptions(isFetched));
  const steps = ["Information", "Shipping", "Payment"];
  const { step } = Route.useSearch();

  const methods = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      country: "Brazil",
      shippingId: 1,
      paymentMethod: "credit-card",
    },
  });

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto flex gap-24">
        <div className="flex-1">
          {/* Header with the steps */}
          <header className="flex gap-3">
            {steps.map((stepName, index) => (
              <div
                key={stepName}
                className="text-mine-shaft flex items-center justify-center gap-6"
              >
                <div
                  className={twMerge(
                    "flex items-center justify-center gap-4 duration-300",
                    index !== step && "text-mine-shaft/50",
                  )}
                >
                  <span
                    className={twMerge(
                      "title ml-3 text-xl text-inherit",
                      index === step && "italic",
                    )}
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span
                    className={twMerge(
                      "text-sm tracking-[0.2em] uppercase",
                      index === step ? "font-medium" : "font-light",
                    )}
                  >
                    {stepName}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <HorizontalDivider
                    className={twMerge(
                      "duration-300",
                      step == index + 1 ? "bg-mine-shaft" : "bg-mine-shaft/20",
                    )}
                  />
                )}
              </div>
            ))}
          </header>

          {/* Div with the form  */}
          <div className="mt-12">
            <FormProvider {...methods}>
              {step === 0 && <CheckoutForm />}
              {step === 1 && <ShippingStep />}
              {step === 2 && <PaymentStep />}
            </FormProvider>
          </div>
        </div>

        {/* Infos about the order */}
        <div className="bg-oyster/5 p-12">
          <h2 className="title text-mine-shaft text-2xl">Your selection</h2>
          <HorizontalDivider className="bg-oyster/20 my-8 w-full" />
          <div className="flex flex-col gap-12">
            {cart?.items.map((item) => (
              <div key={item.variationSku} className="flex gap-6">
                <div className="aspect-square h-24">
                  <img src={item.imageUrl} className="h-full w-full" />
                </div>
                <div className="flex flex-col justify-center gap-2 text-sm">
                  <p className="font-medium tracking-wide uppercase">
                    {item.productName}
                  </p>
                  <div className="text-mine-shaft/80 flex">
                    {item.options.map((option, i) => (
                      <span key={option} className="inline-flex">
                        {option}
                        {i < item.options.length - 1 && <Dot />}
                      </span>
                    ))}
                  </div>
                  <p className="text-mine-shaft/80">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
