import { Mail, User, UserPlus } from "lucide-react";
import { Link } from "react-router";
import Button from "../components/Button";
import FloatingInput from "../components/FloatingInput";
import FloatingInputPassword from "../components/FloatingInputPassword";
import HorizontalDivider from "../components/HorizontalDivider";
import SocialLogin from "../components/SocialLogin";

export default function Register() {
  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
          Create Account
        </h1>
        <HorizontalDivider />
        <p className="text-mine-shaft/80 mt-4">
          Join Maison Senna for a personalized experience
        </p>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput
            icon={<User className="h-4 w-4" />}
            name="first_name"
            id="first_name"
            label="First Name"
          />
          <FloatingInput
            icon={<User className="h-4 w-4" />}
            name="last_name"
            id="last_name"
            label="Last Name"
          />
        </div>

        <FloatingInput
          icon={<Mail className="h-4 w-4" />}
          name="email"
          type="email"
          id="email"
          label="E-mail"
        />

        <FloatingInputPassword />
        <FloatingInputPassword
          label="Confirm Password"
          name="confirm_password"
          id="confirm_password"
        />

        <div className="mt-8">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            className="accent-oyster h-4 w-4 rounded-sm border-2"
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
        </div>

        <Button className="w-full py-6">
          <UserPlus className="mr-2 h-4 w-4" />
          Create Account
        </Button>
      </form>

      <SocialLogin />

      <div className="text text-mine-shaft/90 mt-8 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-oyster hover:underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
