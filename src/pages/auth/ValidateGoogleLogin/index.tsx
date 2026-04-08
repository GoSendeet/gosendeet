import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDefaultRouteForRole } from "@/lib/roles";
import { decryptAES256 } from "@/lib/utils";

const ValidateGoogleLogin = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isError, setIsError] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const encryptedToken = urlParams.get("t") || "";
  const encryptedUser = urlParams.get("u") || "";

  const secretKey = import.meta.env.VITE_SECRET_KEY;

  useEffect(() => {
    const validate = () => {
      try {
        if (!secretKey?.trim()) {
          throw new Error("Google login is not configured correctly");
        }

        if (!encryptedToken.trim() || !encryptedUser.trim()) {
          throw new Error("Google login callback is missing required data");
        }
        console.log("secret ket", secretKey);
        const token = decryptAES256(encryptedToken, secretKey);
        const decryptedUser = decryptAES256(encryptedUser, secretKey);
        console.log("Decrypted token:", token);
        if (!token || !decryptedUser) {
          throw new Error("Invalid encrypted data");
        }

        const user = JSON.parse(decryptedUser);

        // 💾 store session
        // sessionStorage.setItem("token", token);
        // sessionStorage.setItem("user", JSON.stringify(user));

        // toast.success("Login successful!");

        // 👉 redirect
        // navigate("/dashboard", { replace: true });

        const isUnauthenticated =
          sessionStorage.getItem("unauthenticated") === "true";
        const profileImage =
          user.profilePicture ||
          user.profileImage ||
          user.avatar ||
          user.imageUrl ||
          user.picture ||
          user.photoUrl ||
          user.photo ||
          "";

        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userId", String(user.id ?? ""));
        sessionStorage.setItem("role", String(user.role ?? ""));
        sessionStorage.setItem("sessionExpired", "false");
        if (profileImage) {
          sessionStorage.setItem("profileImage", profileImage);
        }
        toast.success("Login Successful");
        if (isUnauthenticated) {
          navigate("/cost-calculator");
        } else {
          navigate(getDefaultRouteForRole(user.role));
        }
      } catch (err) {
        console.error("Google login validation failed:", err);
        setIsError(true);
        toast.error("There was an error validating your login");
        // redirect after 2s
        setTimeout(() => navigate("/signin", { replace: true }), 2000);
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, []);

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
