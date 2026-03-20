import { LoginPasswordInput, SocialLogin } from "@/components/features/auth";
import { Button, FloatingInput, HorizontalDivider } from "@/components/ui";
import { loginSchema } from "@/schemas/auth";
import { useAuth } from "@/store/useAuth";
import { LoginForm } from "@/types";
import { toast } from "@/utils/customToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn, Mail } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const { VITE_GOOGLE_CLIENTID } = import.meta.env;

const searchParams = z.object({
  next: z.string().optional(),
});

export const Route = createFileRoute("/_app/_auth/login")({
  validateSearch: (search) => searchParams.parse(search),
  component: Login,
});

function Login() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const next = search.next ?? "/";

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, register } = methods;
  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    login.mutate(data, {
      onSuccess: (data) => {
        toast.success({ title: data.detail, description: data.description });
        setTimeout(() => {
          navigate({ to: next, replace: true });
        }, 200);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Sign In
        </h1>
        <HorizontalDivider className="mx-auto mt-4" />
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
              {...register("rememberMe")}
              id="remember-me"
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

        <Button
          isLoading={login.isPending}
          className="w-full py-6"
          type="submit"
        >
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
