import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import googleIcon from "../assets/google-logo.svg";
import Button from "./Button";
import { useGoogleOAuth } from "../hooks/auth";

export default function SocialLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useGoogleOAuth(setIsLoading);

  useEffect(() => {
    if (isLoading) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <LoaderCircle className="mr-2 h-14 w-14 animate-spin text-white" />
        </div>
      )}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="border-mine-shaft/30 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-mine-shaft/70 bg-white px-4">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={() => {
              setIsLoading(true);
              login();
            }}
            variant="outline"
            className="text-mine-shaft/80 hover:text-mine-shaft/80 border-oyster/30 hover:bg-oyster/20 active:bg-oyster/30 w-full py-6"
          >
            <img src={googleIcon} alt="Google" className="mr-2 h-6 w-6" />
            Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
}
