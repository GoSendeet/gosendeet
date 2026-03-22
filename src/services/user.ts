import { api, authApi } from "./axios";

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
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getQuotes = async (
  data: any,
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
    const res = await authApi.post(`/quotes?direct=${direct}`, data, {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const shareQuotes = async (data: any) => {
  try {
    const res = await authApi.post(`/quotes/share`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const fetchSharedQuotes = async (id: string) => {
  try {
    const res = await authApi.get(`/quotes/share/${id}`);

    const quotes = res.data?.data?.quotes || [];

    return {
      ...res.data,
      data: quotes,                     // <- overwrite data with quotes
      quoteRequests: res.data?.data?.quoteRequests || [] // keep extra field if needed
    };
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};



export const updateUserProfile = async (id: string, data: any) => {
  try {
    const res = await api.put(`users/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const createBooking = async (data: any) => {
  try {
    ensureAuthenticated();
    const res = await api.post(`/bookings`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const payForBooking = async (bookingId: string, successUrl: string, errorUrl: string) => {
  try {
    ensureAuthenticated();
    const res = await api.post(`/booking/payments/initialize?bookingId=${bookingId}&successUrl=${successUrl}&errorUrl=${errorUrl}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};
