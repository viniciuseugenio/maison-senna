import {
  Button,
  FloatingInput,
  HorizontalDivider,
  SelectInput,
} from "@/components/ui";
import { CheckoutFormValues } from "@/routes/_app/checkout";
import { toast } from "@/utils/customToast";
import { formatPrice } from "@/utils/formatPrice";
import { Link } from "@tanstack/react-router";
import {
  Barcode,
  ChevronLeft,
  CreditCard,
  LucideIcon,
  QrCode,
  ScanQrCode,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type PaymentMethod = {
  id: "pix" | "credit-card" | "bank-slip";
  label: string;
  description: string;
  Icon: LucideIcon;
  content?: React.ReactNode;
  render?: (isSelected: boolean, onSelect: () => void) => React.ReactNode;
};

const PaymentStep: React.FC = () => {
  const { trigger } = useFormContext();

  const paymentMethods: PaymentMethod[] = [
    {
      id: "pix",
      label: "Pix",
      description: "Instant approval. Code valid for 30 minutes.",
      Icon: QrCode,
      content: (
        <div className="flex flex-col items-center justify-center">
          <ScanQrCode
            className="text-mine-shaft mb-2 h-14 w-14"
            strokeWidth={1.5}
          />
          <p className="text-mine-shaft max-w-md text-center tracking-wide">
            Um QR code será gerado na próxima etapa para pagamento imediato.
          </p>
        </div>
      ),
    },
    {
      id: "credit-card",
      label: "Credit Card",
      description: "Up to 10 interest-free installments",
      Icon: CreditCard,
      render: (isSelected: boolean, onSelect: () => void) => (
        <CreditCartItem isSelected={isSelected} onSelect={onSelect} />
      ),
    },
    {
      id: "bank-slip",
      label: "Bank Slip",
      description: "1 to 2 working days to process.",
      Icon: Barcode,
      content: <div></div>,
    },
  ] as const;

  type PaymentMethodId = (typeof paymentMethods)[number]["id"];
  const { watch, setValue } = useFormContext<CheckoutFormValues>();
  const paymentMethod = watch("paymentMethod");
  const setPaymentMethod = (id: PaymentMethodId) =>
    setValue("paymentMethod", id);

  const creditCardFields = [
    "cardNumber",
    "cardHolder",
    "expiryDate",
    "cvv",
    "installments",
  ] as const;

  const fieldsToValidate =
    paymentMethod === "credit-card"
      ? ["paymentMethod", ...creditCardFields]
      : ["paymentMethod"];

  const handleConfirm = async () => {
    const output = await trigger(fieldsToValidate, { shouldFocus: true });

    if (!output) return;

    toast.success({ title: "We are processing your order." });
  };

  return (
    <>
      <h1 className="title text-mine-shaft text-4xl">Payment Method</h1>
      <p className="text-mine-shaft/60 font-light tracking-wide">
        Select your preferred payment method to finish your purchase.
      </p>

      <div className="my-10 flex flex-col gap-6">
        {paymentMethods.map((method) => {
          if (method.render) {
            return (
              <>
                {method.render(method.id === paymentMethod, () =>
                  setPaymentMethod(method.id),
                )}
              </>
            );
          }

          return (
            <PaymentItem
              Icon={method.Icon}
              label={method.label}
              key={method.id}
              description={method.description}
              isSelected={method.id === paymentMethod}
              onSelect={() => setPaymentMethod(method.id)}
            >
              {method.content}
            </PaymentItem>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/checkout"
          className="text-mine-shaft/70 hover:text-mine-shaft flex gap-2 text-lg font-light duration-300"
          search={{ step: 1 }}
        >
          <ChevronLeft />
          Return to Shipping
        </Link>
        <Button
          onClick={handleConfirm}
          type="button"
          color="brown"
          className="px-12 py-8 font-light"
        >
          Complete Purchase
        </Button>
      </div>
    </>
  );
};

const PaymentItem: React.FC<{
  Icon: LucideIcon;
  label: string;
  description: string;
  children: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ Icon, label, description, children, isSelected, onSelect }) => {
  return (
    <motion.div className="bg-oyster/5 group/card p-6">
      <div
        role="checkbox"
        className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-4"
        onClick={onSelect}
      >
        <Icon className="text-mine-shaft" />
        <div className="flex items-center justify-between">
          <div>
            <p className="title text-mine-shaft text-xl">{label}</p>
            <p className="text-mine-shaft font-light tracking-wide">
              {description}
            </p>
          </div>
          <input
            className={twMerge(
              "fill-oyster ring-oyster/50 group-hover/card:bg-oyster/40 group-active/card:bg-oyster/70 accent-oyster h-2 w-2 appearance-none rounded-none ring-2 ring-offset-2 duration-300",
              isSelected && "bg-oyster group-hover/card:bg-oyster-600",
            )}
            checked={isSelected}
            onChange={onSelect}
            type="radio"
          />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6">
              <HorizontalDivider className="bg-oyster/10 w-full" />
              <div className="mt-6">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CreditCartItem: React.FC<{
  isSelected: boolean;
  onSelect: () => void;
}> = ({ isSelected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { watch, setValue } = useFormContext<CheckoutFormValues>();
  const expiryDate = watch("expiryDate");

  useEffect(() => {
    function formatExpiryDate(value: string) {
      const digits = value.replace(/\D/g, "").slice(0, 4);

      if (digits.length <= 2) return digits;
      setValue("expiryDate", `${digits.slice(0, 2)}/${digits.slice(2)}`);
    }

    formatExpiryDate(expiryDate ?? "");
  }, [expiryDate]);

  return (
    <PaymentItem
      Icon={CreditCard}
      label="Credit Card"
      description="Up to 10 interest-free installments"
      isSelected={isSelected}
      onSelect={onSelect}
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          <FloatingInput label="Card Number" name="cardNumber" />
          <FloatingInput label="Nome impresso no cartão" name="cardHolder" />
        </div>
        <FloatingInput
          label="Validade (MM/AA)"
          name="expiryDate"
          maxLength={5}
        />
        <FloatingInput label="CVV" name="cvv" />
        <div className="col-span-2">
          <SelectInput isOpen={isOpen} setIsOpen={setIsOpen} label="PARCELAS">
            <SelectInput.Option>
              1x de {formatPrice(11200)} sem juros
            </SelectInput.Option>
          </SelectInput>
        </div>
      </div>
    </PaymentItem>
  );
};

export default PaymentStep;
