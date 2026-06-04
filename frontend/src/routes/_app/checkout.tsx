import { cartQueryOptions } from "@/api/queries";
import CheckoutForm from "@/components/features/cart/checkout/Form";
import { HorizontalDivider } from "@/components/ui";
import { useAuthUser } from "@/hooks/auth";
import { formatPrice } from "@/utils/formatPrice";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Dot } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

const searchSchema = z.object({
  step: z.number().default(1),
});

export const Route = createFileRoute("/_app/checkout")({
  validateSearch: zodValidator(searchSchema),
  component: Checkout,
});

function Checkout() {
  const { isFetched } = useAuthUser();
  const { data: cart } = useQuery(cartQueryOptions(isFetched));
  const steps = ["Information", "Shipping", "Payment"];
  const { step } = Route.useSearch();

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
          <div className="mt-12">{step === 0 && <CheckoutForm />}</div>
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
