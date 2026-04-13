import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { Spinner } from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "@/services/auth";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  MailCheck,
  RefreshCcw,
} from "lucide-react";

const VerifyEmail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const email = queryParams.get("email") || "";

  const isVerified = status === "success";
  const hasVerificationResult = status !== null;
  const isLoading = !hasVerificationResult;

  const { mutate, isPending } = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success("Verification email sent successfully");
    },
    onError: (data) => {
      toast.error(data?.message || "Unable to resend verification email.");
    },
  });

  const handleResend = () => {
    if (!email) {
      toast.error("No email address was found for this verification request.");
      return;
    }

    mutate(email);
  };

  return (
    <AuthLayout>
      <div className="bg-neutral900 md:px-20 px-6 md:py-20 py-10 min-h-[calc(100vh-88px)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
            <section className="bg-[#0F3324] text-white rounded-[28px] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(109,255,177,0.22),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_35%)]" />
              <div className="relative z-10 h-full flex flex-col justify-between gap-10">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                    <MailCheck className="w-4 h-4" />
                    Account Verification
                  </span>
                  <h1 className="mt-6 text-4xl md:text-5xl font-clash font-semibold tracking-tight leading-tight">
                    One quick step and your account is ready.
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-white/80 max-w-lg leading-7">
                    We&apos;re confirming your email so your deliveries, updates,
                    and account access stay secure from the start.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur-sm">
                    <p className="text-2xl font-semibold font-clash">Secure</p>
                    <p className="mt-2 text-sm text-white/75">
                      Verification helps protect your account before you start
                      booking and tracking shipments.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/10 p-5 backdrop-blur-sm">
                    <p className="text-2xl font-semibold font-clash">Fast</p>
                    <p className="mt-2 text-sm text-white/75">
                      Once your email is confirmed, you can go straight into
                      login and continue onboarding.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[28px] border border-neutral200 p-6 md:p-8 shadow-sm flex flex-col justify-center">
              {isLoading && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green400/30 flex items-center justify-center">
                    <Spinner />
                  </div>
                  <h2 className="mt-6 text-3xl font-clash font-semibold text-neutral600">
                    Verifying your account
                  </h2>
                  <p className="mt-3 text-neutral500 leading-7 max-w-md mx-auto">
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
                  <h2 className="mt-6 text-3xl font-clash font-semibold text-neutral600">
                    Your account has been verified
                  </h2>
                  <p className="mt-3 text-neutral500 leading-7 max-w-md mx-auto">
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
                    <Link to="/signin">
                      <Button className="w-full sm:w-auto bg-green100 hover:bg-green800 text-white">
                        Proceed to Login
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/">
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
                    We couldn&apos;t verify this account
                  </h2>
                  <p className="mt-3 text-neutral500 leading-7 text-center max-w-md mx-auto">
                    The verification link may have expired, already been used,
                    or is no longer valid. You can request a fresh one below.
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

                  <div className="mt-8 flex flex-col gap-3">
                    <Button
                      variant="secondary"
                      className="w-full bg-green100 hover:bg-green800 text-white"
                      onClick={handleResend}
                      loading={isPending}
                    >
                      Resend Verification Email
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
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
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
