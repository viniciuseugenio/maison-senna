import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { camelCase } from "change-case";
import { LogIn, Mail } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/endpoints/auth";
import Button from "../components/Button";
import FloatingInput from "../components/FloatingInput";
import HorizontalDivider from "../components/HorizontalDivider";
import LoginPasswordInput from "../components/Auth/LoginPasswordInput";
import SocialLogin from "../components/Auth/SocialLogin";
import { useUserContext } from "../hooks/auth";
import { loginSchema } from "../schemas/auth";
import { LoginForm } from "../types/auth";
import { toast } from "../utils/customToast";
import { transformKeys } from "../utils/transformKeys";
import { ApiError, ApiResponse } from "../types/api";

const { VITE_GOOGLE_CLIENTID } = import.meta.env;

export default function Login() {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit } = methods;

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: ApiResponse) => {
      const userObj = transformKeys(data.user, camelCase);
      toast.success({
        title: data.detail,
        description: data.description,
      });

      setUser(userObj);
      navigate("/");
    },
    onError: (error: ApiError) => {
      toast.error({
        title: error.title,
        description: error.description,
      });
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Sign In
        </h1>
        <HorizontalDivider />
        <p className="text-mine-shaft/80 mt-4">Welcome back to Maison Senna</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <FloatingInput
          icon={<Mail className="h-4 w-4" />}
          label="E-mail"
          name="email"
          type="email"
        />

        <LoginPasswordInput />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="accent-oyster h-4 w-4 rounded-sm border-2"
            />
            <label
              htmlFor="remember-me"
              className="text-mine-shaft/90 ml-2 text-sm"
            >
              Remember Me
            </label>
          </div>
          <div className="text-sm">
            <Link to="/forgot-password" className="text-oyster hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button isLoading={isPending} className="w-full py-6" type="submit">
          <LogIn className="mr-2 h-4 w-4" /> Sign in
        </Button>
      </form>

      <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENTID}>
        <SocialLogin />
      </GoogleOAuthProvider>

      <div className="text-mine-shaft/90 mt-8 text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-oyster font-medium hover:underline"
        >
          Sign up
        </Link>
      </div>
    </FormProvider>
  );
}
