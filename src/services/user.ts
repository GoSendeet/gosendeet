import { AxiosError } from "axios";
import { api, authApi } from "./axios";

const throwApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<{ message: string }>;
  throw axiosError?.response?.data || { message: (error as Error).message };
};

const ensureAuthenticated = () => {
  const authToken = sessionStorage.getItem("authToken");
  const userId = sessionStorage.getItem("userId");

  if (!authToken || !userId) {
    throw { message: "Please sign in to continue" };
  }
};

export const userDetails = async (id: string) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const getQuotes = async (
  data: unknown,
  direct: boolean = false,
  params?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    companyName?: string;
    hasNextDay?: boolean;
    page?: number;
    size?: number;
  },
) => {
  try {
    console.log("[getQuotes] payload →", JSON.stringify(data, null, 2));
    const res = await authApi.post(`/quotes?direct=${direct}`, data, { params });
    return res.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error("[getQuotes] error:", axiosError?.response?.status, JSON.stringify(axiosError?.response?.data));
    throwApiError(error);
  }
};

export const shareQuotes = async (data: unknown) => {
  try {
    const res = await authApi.post(`/quotes/share`, data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const fetchSharedQuotes = async (id: string) => {
  try {
    const res = await authApi.get(`/quotes/share/${id}`);
    const quotes = res.data?.data?.quotes || [];
    return {
      ...res.data,
      data: quotes,
      quoteRequests: res.data?.data?.quoteRequests || [],
    };
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const updateUserProfile = async (id: string, data: unknown) => {
  try {
    const res = await api.put(`users/${id}`, data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const createBooking = async (data: unknown) => {
  try {
    ensureAuthenticated();
    console.log("[createBooking] payload →", JSON.stringify(data, null, 2));
    const res = await api.post(`/bookings`, data);
    console.log("[createBooking] success →", res.data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const payForBooking = async (bookingId: string, successUrl: string, errorUrl: string) => {
  try {
    ensureAuthenticated();
    const res = await api.post(`/booking/payments/initialize?bookingId=${bookingId}&successUrl=${successUrl}&errorUrl=${errorUrl}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};
