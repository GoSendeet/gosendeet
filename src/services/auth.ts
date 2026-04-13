import { api, BASE_URL, authApi } from "./axios";
import { AxiosError } from "axios";

const throwApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError?.response?.data || { message: (error as Error).message };
};

const APP_BASE_URL = window.location.origin.replace(/\/$/, "");

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
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const validateEmail = async (email: string) => {
  try {
    const res = await authApi.post(`/auth?email=${email}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await authApi.post("/auth/login", data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const resendVerification = async (email: string) => {
  try {
    const res = await authApi.post(`/auth/resend-verification?email=${email}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await authApi.post(`/auth/forgot-password?email=${email}`);
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
    const res = await authApi.post(
      `/auth/reset-password?resetToken=${resetToken}&newPassword=${password}&confirmPassword=${confirmPassword}`
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const changePassword = async (data: any) => {
  try {
    const res = await api.post(`/security/change-password`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const deleteAccount = async () => {
  try {
    const res = await api.delete(`/security`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const activateAccount = async (status: string) => {
  try {
    const res = await api.post(
      `/security/update-account-status?status=${status}`
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const googleLogin = () => {
  // OAuth requires full page redirect, not XHR
  const redirectUrl = encodeURIComponent(APP_BASE_URL.replace(/\/$/, ""));
  window.location.href = `${BASE_URL}/auth/google-login?redirectUrl=${redirectUrl}`;
};


export const googleSignup = () => {
  const redirectUrl = encodeURIComponent(APP_BASE_URL.replace(/\/$/, ""));
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
