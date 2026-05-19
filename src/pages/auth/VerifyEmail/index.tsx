import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { Spinner } from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "@/services/auth";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  MailCheck,
  RefreshCcw,
} from "lucide-react";

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const emailFromQuery = queryParams.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const isVerified = status === "success";
  const hasVerificationResult = status !== null;
  const isLoading = !hasVerificationResult;
  const canResend = secondsLeft === 0;
  const cooldownStorageKey = useMemo(
    () =>
      email.trim()
        ? `verification-resend-until:${email.trim().toLowerCase()}`
        : "",
    [email],
  );

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  useEffect(() => {
    if (!cooldownStorageKey) {
      setSecondsLeft(0);
      return;
    }

    const getRemainingSeconds = () => {
      const rawValue = localStorage.getItem(cooldownStorageKey);
      if (!rawValue) {
        return 0;
      }

      const resendAt = Number(rawValue);
      if (Number.isNaN(resendAt)) {
        localStorage.removeItem(cooldownStorageKey);
        return 0;
      }

      const remaining = Math.max(
        0,
        Math.ceil((resendAt - Date.now()) / 1000),
      );

      if (remaining === 0) {
        localStorage.removeItem(cooldownStorageKey);
      }

      return remaining;
    };

    setSecondsLeft(getRemainingSeconds());

    const interval = window.setInterval(() => {
      setSecondsLeft(getRemainingSeconds());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [cooldownStorageKey]);

  const { mutate, isPending } = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success("Verification email sent successfully");
      if (cooldownStorageKey) {
        localStorage.setItem(
          cooldownStorageKey,
          String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000),
        );
        setSecondsLeft(RESEND_COOLDOWN_SECONDS);
      }
    },
    onError: (data) => {
      toast.error(data?.message || "Unable to resend verification email.");
    },
  });

  const handleResend = () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Enter the email address tied to the unverified account.");
      return;
    }

    if (!canResend) {
      toast.error(`Please wait ${secondsLeft}s before requesting a new link.`);
      return;
    }

    mutate(normalizedEmail);
  };

  return (
    <AuthLayout>
      <div className="bg-neutral900 md:px-20 px-4 sm:px-6 md:py-20 py-6 sm:py-10 min-h-[calc(100vh-88px)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-4 sm:gap-6 items-stretch">
            <section className="bg-white rounded-2xl md:rounded-[28px] border border-neutral200 p-4 sm:p-6 md:p-8 shadow-sm flex flex-col justify-center">
              {isLoading && (
                <div className="text-center py-6 sm:py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green400/30 flex items-center justify-center">
                    <Spinner />
                  </div>
                  <h2 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-clash font-semibold text-neutral600">
                    Verifying your account
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-neutral500 leading-6 sm:leading-7 max-w-md mx-auto">
                    Please hold on while we confirm your verification link and
                    prepare your account.
                  </p>
                </div>
              )}

              {!isLoading && isVerified && (
                <div className="text-center py-6">
                  <div className="w-[72px] h-[72px] mx-auto rounded-full bg-green400/30 text-green700 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="mt-5 sm:mt-6 text-2xl sm:text-3xl font-clash font-semibold text-neutral600">
                    Your account has been verified
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-neutral500 leading-6 sm:leading-7 max-w-md mx-auto">
                    Everything looks good. You can now sign in and start using
                    Gosendeet.
                  </p>

                  {email && (
                    <div className="mt-6 rounded-2xl bg-neutral100 border border-neutral200 px-4 py-4 text-left">
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral500 font-semibold">
                        Verified Email
                      </p>
                      <p className="mt-2 text-sm text-neutral600 break-all">
                        {email}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/signin" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto bg-green100 hover:bg-green800 text-white">
                        Proceed to Login
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/" className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto border-neutral300"
                      >
                        Go to Homepage
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {!isLoading && !isVerified && (
                <div className="py-6">
                  <div className="w-[72px] h-[72px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                    <CircleAlert className="w-10 h-10" />
                  </div>
                  <h2 className="mt-6 text-3xl font-clash font-semibold text-neutral600 text-center">
                    This account is not verified.
                  </h2>
                  <p className="mt-3 text-neutral500 leading-7 text-center max-w-md mx-auto">
                    Click the button below to verify your account.
                  </p>

                  {email && (
                    <div className="mt-6 rounded-2xl bg-neutral100 border border-neutral200 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral500 font-semibold">
                        Email Address
                      </p>
                      <p className="mt-2 text-sm text-neutral600 break-all">
                        {email}
                      </p>
                    </div>
                  )}

                  {!emailFromQuery && (
                    <div className="mt-6">
                      <label className="text-xs uppercase tracking-[0.18em] text-neutral500 font-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your account email"
                        className="mt-3 w-full rounded-2xl border border-neutral300 px-4 py-4 text-sm text-neutral600 outline-none transition focus:border-green500"
                      />
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3">
                    <Button
                      variant="secondary"
                      className="w-full bg-green100 hover:bg-green800 text-white"
                      onClick={handleResend}
                      loading={isPending}
                      disabled={isPending || !canResend}
                    >
                      {canResend
                        ? "Send Verification Email"
                        : `Resend available in ${secondsLeft}s`}
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                    {!canResend && (
                      <div className="rounded-2xl border border-neutral200 bg-neutral100 px-4 py-3 text-sm text-neutral500 flex items-center gap-2">
                        <Clock3 className="w-4 h-4 text-green600" />
                        You can request another verification email in{" "}
                        <span className="font-semibold text-neutral600">
                          {secondsLeft}s
                        </span>
                        .
                      </div>
                    )}
                    <Link to="/signup">
                      <Button
                        variant="outline"
                        className="w-full border-neutral300"
                      >
                        Back to Signup
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-[#0F3324] text-white rounded-2xl md:rounded-[28px] p-5 sm:p-7 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(109,255,177,0.22),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_35%)]" />
              <div className="relative z-10 h-full flex flex-col justify-between gap-6 sm:gap-8 md:gap-10">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em]">
                    <MailCheck className="w-4 h-4" />
                    Account Verification
                  </span>
                  <h1 className="mt-5 sm:mt-6 text-[30px] sm:text-4xl md:text-5xl font-clash font-semibold tracking-tight leading-tight">
                    One quick step and your account is ready.
                  </h1>
                  <p className="mt-3 sm:mt-4 text-sm md:text-base text-white/80 max-w-lg leading-6 sm:leading-7">
                    We&apos;re confirming your email so your deliveries, updates,
                    and account access stay secure from the start.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
