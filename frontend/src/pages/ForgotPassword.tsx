import { requestPasswordReset } from "@/api/endpoints/auth";
import { toast } from "@/utils/customToast";
import Button from "@components/ui/Button";
import FloatingInput from "@components/ui/FloatingInput";
import HorizontalDivider from "@components/ui/HorizontalDivider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { handleSubmit, getValues, setValue } = methods;
  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      toast.success({
        title: data.detail,
        description: data.description,
      });
    },
  });
  const email = getValues().email;

  const onSubmit: SubmitHandler<ForgotPasswordType> = async (data) => {
    mutate(data.email);
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Reset Password
        </h1>
        <HorizontalDivider />
        <p className="text-mine-shaft/80 mt-4">
          {!isSuccess ? (
            <span>Enter your email to receive reset instructions</span>
          ) : (
            <span>Check your email for reset instructions</span>
          )}
        </p>
      </div>

      {!isSuccess ? (
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <FloatingInput
            icon={<Mail className="h-4 w-4" />}
            label="E-mail"
            name="email"
            type="email"
          />
          <Button isLoading={isPending} className="w-full">
            Send Reset Instructions
          </Button>
          <div className="text-center">
            <Link to="/login" className="text-oyster text-sm hover:underline">
              Return to login
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="bg-oyster/30 rounded-sm p-6 text-center">
            <p className="text-mine-shaft mb-2 font-medium">Reset Email Sent</p>
            <p className="text-mine-shaft/80">
              We've sent password reset instructions to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-col justify-center text-center">
            <p className="text-mine-shaft/80 mb-4 text-sm">
              Didn't receive an email? Check your spam folder
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setValue("email", "");
              }}
              className="text-oyster hover:text-oyster border-oyster/30 hover:bg-oyster/20 self-center bg-transparent duration-300"
            >
              Try again
            </Button>
          </div>
        </div>
      )}
    </FormProvider>
  );
}
