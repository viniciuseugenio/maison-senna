import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { camelCase, snakeCase } from "change-case";
import { Mail, User, UserPlus } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/endpoints/auth";
import RegisterPasswordInputs from "../components/Auth/RegisterPasswordInputs";
import SocialLogin from "../components/Auth/SocialLogin";
import Button from "../components/Button";
import FloatingInput from "../components/FloatingInput";
import HorizontalDivider from "../components/HorizontalDivider";
import { REGISTER_FORM_ERRORS } from "../constants/auth";
import { registerSchema } from "../schemas/auth";
import { ApiError } from "../types/api";
import { RegisterForm } from "../types/auth";
import { toast } from "../utils/customToast";
import { transformKeys } from "../utils/transformKeys";

const { VITE_GOOGLE_CLIENTID } = import.meta.env;

export default function Register() {
  const navigate = useNavigate();

  const methods = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (result) => {
      if (result.errors) {
        const objectErrors = transformKeys(result.errors, camelCase);

        Object.entries(objectErrors).forEach(([field, messages]) => {
          setError(field as keyof RegisterForm, {
            type: "server",
            message: messages[0],
          });
        });

        toast.error({
          title: "An error occurred",
          description: REGISTER_FORM_ERRORS.FORM_ERROR,
        });
        return;
      }

      toast.success({
        title: result.detail,
        description: result.description,
      });
      navigate("/login", { replace: true });
    },
    onError: (error: ApiError) => {
      toast.error({
        title: error.title,
        description: error.description,
      });
    },
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    const object = transformKeys(data, snakeCase);
    mutate(object);
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Create Account
        </h1>
        <HorizontalDivider className="mx-auto" />
        <p className="text-mine-shaft/80 mt-4">
          Join Maison Senna for a personalized experience
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            icon={<User className="h-4 w-4" />}
            name="firstName"
            label="First Name"
            error={errors.firstName?.message}
          />

          <FloatingInput
            icon={<User className="h-4 w-4" />}
            name="lastName"
            label="Last Name"
            error={errors.lastName?.message}
          />
        </div>

        <FloatingInput
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" />}
          name="email"
          label="E-mail"
        />

        <RegisterPasswordInputs
          passwordError={errors.password?.message}
          confirmPasswordError={errors.confirmPassword?.message}
        />

        <div className="mt-8">
          <input
            type="checkbox"
            id="terms"
            className="accent-oyster h-4 w-4 rounded-sm border-2"
            {...register("terms")}
          />
          <label className="text-mine-shaft/80 ml-2 text-sm" htmlFor="terms">
            I agree to the{" "}
            <Link to="/" className="text-oyster hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="text-oyster hover:underline">
              Privacy Policy
            </Link>
          </label>
          <div className="mt-1 text-xs font-medium text-red-600">
            {errors.terms?.message}
          </div>
        </div>

        <Button
          isLoading={isPending}
          loadingLabel="Registering..."
          className="w-full py-6"
          type="submit"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </form>

      <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENTID}>
        <SocialLogin />
      </GoogleOAuthProvider>

      <div className="text text-mine-shaft/90 mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-oyster hover:underline">
          Sign in
        </Link>
      </div>
    </FormProvider>
  );
}
