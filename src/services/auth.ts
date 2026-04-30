import { api, BASE_URL, authApi } from "./axios";
import { throwApiError } from "@/lib/errorHandling";

const resolveAppBaseUrl = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin.replace(/\/$/, "");
};

export interface AuthenticatedUserPayload {
  user: {
    id: string;
    role: string;
    profilePicture?: string;
    profileImage?: string;
    avatar?: string;
    imageUrl?: string;
    picture?: string;
    photoUrl?: string;
    photo?: string;
    [key: string]: unknown;
  };
}

export const signup = async (data: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  companyEmail?: string;
  role?: string;
}) => {
  try {
    const res = await authApi.post("/auth/create-account", data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const validateEmail = async (email: string) => {
  try {
    const res = await authApi.post("/auth", { email });
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await authApi.post("/auth/login", data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const getAuthSession = async () => {
  try {
    const res = await authApi.get<{
      data: AuthenticatedUserPayload;
      message?: string;
      success?: boolean;
    }>("/auth/session");
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const resendVerification = async (email: string) => {
  try {
    const res = await authApi.post("/auth/resend-verification", { email });
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await authApi.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};


export const resetPassword = async ({
  resetToken,
  password,
  confirmPassword,
}: {
  resetToken: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const res = await authApi.post("/auth/reset-password", {
      resetToken,
      newPassword: password,
      confirmPassword,
    });
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const changePassword = async (data: any) => {
  try {
    const res = await api.post(`/security/change-password`, data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const deleteAccount = async () => {
  try {
    const res = await api.delete(`/security`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const activateAccount = async (status: string) => {
  try {
    const res = await api.post(
      `/security/update-account-status?status=${status}`
    );
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const googleLogin = () => {
  // OAuth requires full page redirect, not XHR
  const redirectUrl = encodeURIComponent(resolveAppBaseUrl());
  window.location.href = `${BASE_URL}/auth/google-login?redirectUrl=${redirectUrl}`;
};


export const googleSignup = () => {
  const redirectUrl = encodeURIComponent(resolveAppBaseUrl());
  window.location.href = `${BASE_URL}/auth/google-signup?redirectUrl=${redirectUrl}`;
}

// export const googleLogin = async () => {
//   try {
//     const res = await fetch("/auth/google-login", {
//       method: "GET",
//       credentials: "include", // only if cookies/sessions are used
//     });

//     if (!res.ok) {
//       const errorData = await res.json().catch(() => ({}));
//       throw errorData || { message: "Request failed" };
//     }

//     return await res.json();
//   } catch (error: any) {
//     throw error?.message ? { message: error.message } : error;
//   }
// };
