import { Button, HorizontalDivider } from "@/components/ui";
import { formatPrice } from "@/utils/formatPrice";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const ShippingStep: React.FC = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(1);
  const deliveryMethods = [
    {
      id: 1,
      name: "Standard Courier",
      delivery: "3 to 5 business days",
      price: 0,
    },
    {
      id: 2,
      name: "Express Atelier Delivery",
      delivery: "1 to 2 business days",
      price: 25,
    },
    {
      id: 3,
      name: "White Glove Concierge",
      delivery: "Scheduled delivery with professional assembl",
      price: 75,
    },
  ];

  return (
    <>
      <h1 className="title mb-12 text-3xl">Shipping Method</h1>

      <div className="bg-mine-shaft/5 relative p-8">
        <InfoItem label="Contact" info="elara.vance@atelier.com" />
        <HorizontalDivider className="bg-mine-shaft/15 my-6 w-full" />
        <InfoItem
          label="Ship To"
          info="24 Rue du Faubourg Saint-Honoré, 75008 Paris, France"
        />
        <button className="text-oyster-700 absolute top-6 right-6 cursor-pointer font-light underline underline-offset-2">
          Change
        </button>
      </div>

      <div className="my-10">
        <h2 className="text-mine-shaft/60 tracking-widest uppercase">
          Available Options
        </h2>

        <div className="mt-6">
          {deliveryMethods.map((method, index) => (
            <>
              <HorizontalDivider className="bg-oyster/15 w-full" />
              <div
                role="checkbox"
                key={method.id}
                onClick={() => setSelectedDelivery(method.id)}
                className="hover:bg-mine-shaft/5 grid grid-cols-[auto_1fr] items-center gap-4 px-6 py-8 duration-300"
              >
                <div
                  className={twMerge(
                    "h-5 w-5 rounded-full",
                    selectedDelivery === method.id
                      ? "border-oyster border-6"
                      : "border-mine-shaft/10 border-2",
                  )}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-mine-shaft text-lg font-medium">
                      {method.name}
                    </p>
                    <p className="text-mine-shaft/70">{method.delivery}</p>
                  </div>
                  <p className="font-light tracking-wide">
                    {method.price > 0 ? formatPrice(method.price) : "Free"}
                  </p>
                </div>
              </div>
              {index === deliveryMethods.length - 1 && (
                <HorizontalDivider className="bg-oyster/15 w-full" />
              )}
            </>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          to="/checkout"
          search={{ step: 0 }}
          className="flex gap-2 text-lg font-light text-stone-600 hover:text-stone-800"
        >
          <ChevronLeft />
          Return to Information
        </Link>
        <Button as={Link} to="/checkout" color="brown" search={{ step: 2 }}>
          Continue to Payment
        </Button>
      </div>
    </>
  );
};

const InfoItem: React.FC<{ label: string; info: string }> = ({
  label,
  info,
}) => {
  return (
    <div>
      <p className="text-mine-shaft/50 text-xs tracking-widest uppercase">
        {label}
      </p>
      <p className="mt-1 font-light">{info}</p>
    </div>
  );
};

export default ShippingStep;
