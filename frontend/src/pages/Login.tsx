import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import Button from "../components/Button";
import FloatingInput from "../components/FloatingInput";
import HorizontalDivider from "../components/HorizontalDivider";
import LoginPasswordInput from "../components/LoginPasswordInput";
import SocialLogin from "../components/SocialLogin";

const loginScheme = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const methods = useForm({
    resolver: zodResolver(loginScheme),
  });

  const { register, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Sign In
        </h1>
        <HorizontalDivider />
        <p className="text-mine-shaft/80 mt-4">Welcome back to Maison Senna</p>
      </div>

      <form className="space-y-8">
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

        <Button className="w-full py-6" type="submit">
          <LogIn className="mr-2 h-4 w-4" /> Sign in
        </Button>
      </form>

      <SocialLogin />

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
