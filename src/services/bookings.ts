import { api } from "./axios";
import { throwApiError } from "@/lib/errorHandling";

export const getBookingsById = async (id: string) => {
  try {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const getAllBookings = async ({
  page,
  bookingStatus,
  packageTypeId,
  companyId,
  senderId,
  search,
  startDate,
  endDate,
}: {
  page: number;
  bookingStatus?: string;
  packageTypeId?: string;
  companyId?: string;
  senderId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
) => {
  try {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    if (bookingStatus) params.append("status", bookingStatus);
    if (packageTypeId) params.append("packageTypeId", packageTypeId);
    if (companyId) params.append("companyId", companyId);
    if (senderId) params.append("senderId", senderId);
    if (search) params.append("searchTerm", search);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await api.get(`/bookings?${params.toString()}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};


export const getBookingStats = async ({
  companyId,
  senderId,
}: {
  companyId?: string;
  senderId?: string;
}) => {
  try {

    const params = new URLSearchParams();

    if (companyId) params.append("companyId", companyId);
    if (senderId) params.append("senderId", senderId);

    const res = await api.get(`/bookings/stats?${params.toString()}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};


export const createTrackingHistory = async (data: any) => {
  try {
    const res = await api.post(`/tracking-history`, data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};


export const trackBookings = async (id: string) => {
  try {
    const res = await api.get(`/bookings/track/${id}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};


export const createRatings = async (data: any) => {
  try {
    const res = await api.post(`/ratings`, data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};
