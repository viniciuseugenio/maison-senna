import { resetPassword } from "@/api/endpoints/auth";
import { errorNotifications } from "@/constants/auth";
import { toast } from "@/utils/customToast";
import { validatePassword } from "@/utils/validatePassword";
import FloatingInputPassword from "@components/features/auth/FloatingInputPassword";
import PasswordRequirement from "@components/features/auth/PasswordRequirement";
import Button from "@components/ui/Button";
import HorizontalDivider from "@components/ui/HorizontalDivider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const uid: string = searchParams.get("uid");
  const token: string = searchParams.get("token");

  useEffect(() => {
    if (!uid || !token) {
      toast.error({
        title: errorNotifications.resetPasswordTokens.title,
        description: errorNotifications.resetPasswordTokens.description,
        customId: "missing-tokens",
      });
      navigate("/forgot-password");
    }
  }, [uid, token, navigate]);

  const methods = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  const { getValues, handleSubmit } = methods;

  const password = getValues("password") || "";
  const confirmPassword = getValues("confirmPassword") || "";

  const validationErrors = validatePassword(password, confirmPassword);
  const hasError = Object.values(validationErrors).some((value) => !value);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success({
        title: data.detail,
        description: data.description,
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error({
        title: error.detail,
        description: error.description,
      });
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);
  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    if (hasError) {
      toast.error({
        title: errorNotifications.resetPasswordValidation.title,
        description: errorNotifications.resetPasswordValidation.description,
      });
      return;
    }
    mutate({ uid, token, new_password: data.password });
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Reset Password
        </h1>
        <HorizontalDivider />
        <p className="text-mine-shaft/80 mt-4 text-sm">
          Create a new password for your account
        </p>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <FloatingInputPassword
          showPassword={showPassword}
          togglePassword={togglePassword}
        />
        <FloatingInputPassword
          name="confirmPassword"
          label="Confirm Password"
          showPassword={showPassword}
          togglePassword={togglePassword}
        />
        <div className="bg-oyster/20 border-oyster/30 border p-4">
          <p className="text-mine-shaft mb-3 text-sm font-medium">
            Password Requirements:
          </p>
          <ul className="space-y-2 text-sm">
            <PasswordRequirement
              label="At least 8 characters"
              isValid={validationErrors.hasMinLength}
            />
            <PasswordRequirement
              label="At least one uppercase letter"
              isValid={validationErrors.hasUpperCharacter}
            />
            <PasswordRequirement
              label="At least one lowercase letter"
              isValid={validationErrors.hasLowerCharacter}
            />
            <PasswordRequirement
              label="At least one number"
              isValid={validationErrors.hasNumber}
            />
            <PasswordRequirement
              label="At least one special character"
              isValid={validationErrors.hasSpecialCharacter}
            />
            <PasswordRequirement
              label="Passwords match"
              isValid={validationErrors.passwordsMatch}
            />
          </ul>
        </div>
        <Button isLoading={isPending} type="submit" className="w-full py-6">
          Reset Password
        </Button>
        <div className="text-center">
          <Link to="/login" className="text-oyster text-sm hover:underline">
            Return to login
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default ResetPassword;
