import type { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";

import { resendVerification } from "@/services/auth";

type ApiErrorLike = {
  data?: string;
  message?: string;
};

export const isUnverifiedAccountError = (error: unknown) =>
  (error as ApiErrorLike | undefined)?.data === "EMAIL_NOT_VERIFIED";

export const sendVerificationMailAndNavigate = async (
  email: string,
  navigate: NavigateFunction,
) => {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    toast.error("Your account is not verified. Please enter your email to continue.");
    navigate("/verify-account?status=pending");
    return;
  }

  try {
    await resendVerification(normalizedEmail);
    toast.success("Verification email sent. Please verify your account to continue.");
    navigate(
      `/verify-account?status=pending&email=${encodeURIComponent(
        normalizedEmail,
      )}&sent=1`,
      { replace: true },
    );
  } catch (error: unknown) {
    const apiError = error as ApiErrorLike | undefined;
    const isMailServerDown = apiError?.data === "MAIL_SERVER_DOWN";

    toast.error(
      apiError?.message ||
        "Your account is not verified. Please request a new verification email.",
    );

    navigate(
      `/verify-account?status=pending&email=${encodeURIComponent(
        normalizedEmail,
      )}${isMailServerDown ? "&mailError=1" : ""}`,
      { replace: true },
    );
  }
};
