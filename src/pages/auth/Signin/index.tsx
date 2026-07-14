import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import google from "@/assets/icons/google.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline, MdLockOutline } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { googleLogin, login } from "@/services/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { identifyUser, track, EVENT } from "@/lib/analytics";
import { storeAuthSession } from "@/lib/authSession";
import { getDefaultRouteForRole } from "@/lib/roles";
import { getPreSigninQuoteDashboardRoute } from "@/lib/preSigninQuote";
import {
  isUnverifiedAccountError,
  sendVerificationMailAndNavigate,
} from "@/lib/accountVerification";

const schema = z.object({
  email: z
    .string({ required_error: "Email Address is required" })
    .min(1, { message: "Email Address cannot be empty" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});

type SigninFormValues = z.infer<typeof schema>;

const Signin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Email from the last failed login attempt — used to offer the verification path
  const [failedEmail, setFailedEmail] = useState<string | null>(null);

  useEffect(() => {
    track(EVENT.LOGIN_STARTED);
  }, []);
  // const showGoogleAuth =
  //   import.meta.env.DEV ||
  //   window.location.hostname.toLowerCase().includes("gosendeet-beta.vercel.app");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SigninFormValues) => login(data),
    onSuccess: (response, submittedData) => {
      const user = response?.data?.user;
      if (!user) {
        toast.error("Invalid login response");
        return;
      }

      storeAuthSession(user);
      identifyUser(String(user.id), {
        role: user.role,
        $email: submittedData.email,
        $name: user.username,
      });
      track(EVENT.LOGIN_COMPLETED, { method: "email", role: user.role });

      toast.success("Login Successful");
      const quoteRoute =
        String(user.role ?? "").toLowerCase() === "user"
          ? getPreSigninQuoteDashboardRoute()
          : null;

      if (quoteRoute) {
        navigate(quoteRoute.pathname, {
          state: quoteRoute.state,
          replace: true,
        });
        return;
      }

      navigate(getDefaultRouteForRole(user.role));
    },
    onError: async (
      error: { message?: string; data?: string },
      submittedData,
    ) => {
      if (isUnverifiedAccountError(error)) {
        setFailedEmail(submittedData.email);
        await sendVerificationMailAndNavigate(submittedData.email, navigate);
        return;
      }

      // Backend returns EMAIL_NOT_VERIFIED only after the password check
      // passed, so the banner is shown strictly for unverified accounts
      setFailedEmail(
        error?.data === "EMAIL_NOT_VERIFIED" ? submittedData.email : null,
      );
      toast.error(error?.message || "Login failed");
    },
  });

  const onSubmit = (data: SigninFormValues) => {
    mutate(data);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    googleLogin();
  };

  return (
    <AuthLayout>
      <div className="md:px-20 px-2.5 md:py-20 py-8">
        <div className="xl:w-1/2 md:w-[80%] mx-auto bg-neutral900 py-12 md:px-10 px-4 rounded-3xl">
          <h1 className="lg:text-[40px] text-[30px] font-semibold font-inter mb-1 tracking-tight">
            Sign in to your account
          </h1>
          <p className="font-medium text-neutral800">
            Enter your details to access your account
          </p>

          <Button
            variant={"outline"}
            className="border-neutral500 bg-transparent w-full mt-8 mb-4 hover:bg-white hover:border-0"
            onClick={handleGoogleLogin}
            loading={loading}
          >
            <img src={google} alt="google" className="w-[20px]" />
            <span>Continue with Google</span>
          </Button>

          <p className="text-center font-medium text-neutral800">OR</p>

          <div className="py-4 text-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <MdOutlineMailOutline className="text-green500 text-xl" />
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className="font-inter font-semibold">
                    Email Address
                  </label>
                  <input
                    type="text"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className="w-full outline-0"
                  />
                  {errors.email && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <MdLockOutline className="text-green500 text-xl" />
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="password" className="font-inter font-semibold">
                    Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      className="w-full outline-0 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-green500"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <Link
                to={"/forgot-password"}
                className="text-green500 border-b border-b-green500 text-base"
              >
                Forgot Password?
              </Link>
              <Button
                // variant={"secondary"}
                loading={isPending}
                className=" w-full my-5 bg-green100 hover:bg-green800"
              >
                Login
              </Button>
            </form>
            {failedEmail && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-4">
                Your email has not been verified yet. Please verify it before
                logging in.{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/verify-account?status=pending&email=${encodeURIComponent(failedEmail)}`,
                    )
                  }
                  className="font-semibold underline text-amber-900 cursor-pointer"
                >
                  Verify your account
                </button>
              </div>
            )}
            <div className="text-center mt-6">
              <p className="text-grey300 text-sm">
                Don't have an account?{" "}
                <Link to="/signup">
                  <span className="text-blue100 font-semibold hover:underline">
                    Sign Up
                  </span>
                </Link>
              </p>
            </div>
          </div>

          <p className="font-medium text-neutral800 text-center lg:text-base text-sm">
            By continuing, you accept our{" "}
            <Link to="/terms">
              <span className="border-b border-b-neutral800">
                Terms of Use
              </span>{" "}
            </Link>
            and{" "}
            <Link to="/privacy">
              <span className="border-b border-b-neutral800">
                Privacy Policy
              </span>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signin;
