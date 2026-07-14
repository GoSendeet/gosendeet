import { useState } from "react";
import type { FormEvent, InputHTMLAttributes } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { login, signup } from "@/services/auth";
import { storeAuthSession } from "@/lib/authSession";
import { getDefaultRouteForRole, isDeveloperRole } from "@/lib/roles";
import { createSignupUsername } from "@/utils/username";
import logo from "@/assets/images/logo-green.png";
import {
  isUnverifiedAccountError,
  sendVerificationMailAndNavigate,
} from "@/lib/accountVerification";

type AuthMode = "signin" | "signup";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hasError?: boolean;
};

const AuthField = ({ label, className = "", hasError = false, ...props }: AuthFieldProps) => (
  <label
    className={`group flex min-h-[66px] min-w-0 flex-col justify-center rounded-2xl border bg-white px-4 transition-colors focus-within:border-green500 focus-within:ring-2 focus-within:ring-green500/10 ${
      hasError ? "border-red-500" : "border-neutral500"
    } ${className}`}
  >
    <span className="text-xs font-semibold text-neutral600">{label}</span>
    <input
      {...props}
      className="mt-1 w-full bg-transparent text-base font-semibold text-blue100 outline-none placeholder:text-neutral500"
    />
  </label>
);

const DeveloperAuth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [allowUpdates, setAllowUpdates] = useState(false);
  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const signin = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const user = response?.data?.user;
      if (!user) {
        toast.error("Invalid login response");
        return;
      }

      storeAuthSession(user);
      toast.success("Login Successful");
      navigate(isDeveloperRole(user.role) ? "/developer-dashboard" : getDefaultRouteForRole(user.role), {
        replace: true,
      });
    },
    onError: async (error: any) => {
      if (isUnverifiedAccountError(error)) {
        await sendVerificationMailAndNavigate(signinForm.email, navigate);
        return;
      }

      toast.error(error?.message || "Login failed");
    },
  });

  const developerSignup = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Developer account created. Please sign in to continue.");
      setMode("signin");
      setSigninForm((current) => ({ ...current, email: signupForm.email }));
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to create developer account");
    },
  });

  const handleModeChange = (nextMode: AuthMode) => {
    setShowPassword(false);
    setMode(nextMode);
  };

  const handleSignin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signin.mutate(signinForm);
  };

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    developerSignup.mutate({
      ...signupForm,
      confirmPassword: signupForm.password,
      username: createSignupUsername(signupForm.firstName, signupForm.lastName),
      role: "DEVELOPER",
    });
  };

  const isSignup = mode === "signup";
  const activePassword = isSignup ? signupForm.password : signinForm.password;
  const passwordType = showPassword ? "text" : "password";

  return (
    <main className="min-h-screen overflow-x-hidden bg-neutral700 px-4 py-8 text-blue100 sm:px-6 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-full items-center sm:max-w-[560px]">
        <div className="flex min-h-[760px] w-full max-w-full flex-col overflow-hidden rounded-3xl bg-white px-6 py-8 shadow-sm sm:px-12 sm:py-12">
          <Link to="/" aria-label="Go to GoSendeet home" className="mb-6 inline-flex w-fit">
            <img src={logo} alt="GoSendeet" className="h-9 w-auto" />
          </Link>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="min-w-0 font-clash text-3xl font-semibold leading-none text-blue100 sm:text-5xl">
              {isSignup ? "Create account" : "Sign in"}
            </h1>
            <button
              type="button"
              onClick={() => handleModeChange(isSignup ? "signin" : "signup")}
              className="shrink-0 text-base font-bold text-green500 transition-colors hover:text-green800"
            >
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <form
              onSubmit={handleSignup}
              className={`${isSignup ? "flex" : "hidden"} min-h-[590px] min-w-0 flex-col`}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthField
                  required
                  label="First name *"
                  autoComplete="given-name"
                  value={signupForm.firstName}
                  onChange={(event) => setSignupForm({ ...signupForm, firstName: event.target.value })}
                />
                <AuthField
                  required
                  label="Last name *"
                  autoComplete="family-name"
                  value={signupForm.lastName}
                  onChange={(event) => setSignupForm({ ...signupForm, lastName: event.target.value })}
                />
              </div>

              <AuthField
                required
                type="email"
                label="Email address *"
                autoComplete="email"
                value={signupForm.email}
                onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
                className="mt-5"
              />

              <div className="relative mt-5">
                <AuthField
                  required
                  type={passwordType}
                  label="Password *"
                  minLength={8}
                  autoComplete="new-password"
                  value={activePassword}
                  onChange={(event) => setSignupForm({ ...signupForm, password: event.target.value })}
                  className="pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral600 transition-colors hover:text-green500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              <label className="mt-6 flex items-start gap-3 text-sm font-semibold leading-6 text-blue100">
                <input
                  type="checkbox"
                  checked={allowUpdates}
                  onChange={(event) => setAllowUpdates(event.target.checked)}
                  className="mt-1 size-5 shrink-0 rounded border-neutral500 accent-green500"
                />
                <span>
                  GoSendeet may email me with developer updates, API notices, and product news.
                </span>
              </label>

              <div className="mt-auto pt-8">
                <p className="mb-6 text-sm leading-6 text-neutral500">
                  Your developer account information is used in accordance with the{" "}
                  <Link to="/privacy" className="font-bold text-green500 hover:text-green800">
                    GoSendeet Privacy Policy.
                  </Link>
                </p>
                <Button
                  type="submit"
                  loading={developerSignup.isPending}
                  className="h-14 w-full rounded-2xl bg-green100 text-base font-bold hover:bg-green800"
                >
                  Create
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>

            <form
              onSubmit={handleSignin}
              className={`${!isSignup ? "flex" : "hidden"} min-h-[590px] min-w-0 flex-col`}
            >
              <AuthField
                required
                type="email"
                label="Email address *"
                autoComplete="email"
                value={signinForm.email}
                onChange={(event) => setSigninForm({ ...signinForm, email: event.target.value })}
              />

              <div className="relative mt-5">
                <AuthField
                  required
                  type={passwordType}
                  label="Password *"
                  autoComplete="current-password"
                  value={activePassword}
                  onChange={(event) => setSigninForm({ ...signinForm, password: event.target.value })}
                  className="pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral600 transition-colors hover:text-green500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 font-semibold text-blue100">
                  <input type="checkbox" className="size-4 rounded border-neutral500 accent-green500" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="font-bold text-green500 hover:text-green800">
                  Forgot password?
                </Link>
              </div>

              <div className="mt-auto pt-8">
                <p className="mb-6 text-sm leading-6 text-neutral500">
                  Sign in with a developer account to manage client apps, credentials, and API access.
                </p>
                <Button
                  type="submit"
                  loading={signin.isPending}
                  className="h-14 w-full rounded-2xl bg-green100 text-base font-bold hover:bg-green800"
                >
                  Sign in
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeveloperAuth;
