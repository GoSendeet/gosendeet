import { Spinner } from "@/components/Spinner";
import { storeAuthSession } from "@/lib/authSession";
import { getDefaultRouteForRole } from "@/lib/roles";
import { getAuthSession } from "@/services/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ValidateGoogleLogin = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const response = await getAuthSession();
        const user = response?.data?.user;

        if (!user) {
          throw new Error("Google login callback did not create a valid session");
        }

        const isUnauthenticated =
          sessionStorage.getItem("unauthenticated") === "true";

        storeAuthSession(user);
        toast.success("Login Successful");

        if (isUnauthenticated) {
          navigate("/cost-calculator", { replace: true });
        } else {
          navigate(getDefaultRouteForRole(String(user.role ?? "")), { replace: true });
        }
      } catch (error) {
        console.error("Google login validation failed:", error);
        setIsError(true);
        toast.error("There was an error validating your login");
        window.setTimeout(() => navigate("/signin", { replace: true }), 2000);
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [navigate]);

  return (
    <>
      {isValidating && (
        <div className="h-screen w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="h-screen w-full flex flex-col gap-3 items-center justify-center">
          <p className="text-[#293056] font-bold text-2xl">
            There was an error validating your login
          </p>

          <p className="text-[#667085] text-sm">
            You will be redirected to the login screen
          </p>
        </div>
      )}
    </>
  );
};

export default ValidateGoogleLogin;
