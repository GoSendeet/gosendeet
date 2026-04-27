import { api } from "./axios";
import { throwApiError } from "@/lib/errorHandling";

export const getProfiles = async (
  page: number,
  size: number,
  userStatus: string,
  role: string,
  search: string,
  startDate: string,
  endDate: string
) => {
  const rawParams: Record<string, string | number> = { page, size, status: userStatus, role, search, startDate, endDate };
  const cleanParams = Object.fromEntries(
    Object.entries(rawParams).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );
  const queryString = new URLSearchParams(cleanParams as Record<string, string>).toString();

  try {
    const res = await api.get(`/users?${queryString}`);
    return res.data;
  } catch (error: unknown) {
    //const axiosError = error as AxiosError<{ message: string }>;
    //console.error("[getProfiles] error:", axiosError?.response?.status, JSON.stringify(axiosError?.response?.data));
    throwApiError(error);
  }
};

export const getSingleProfile = async (id: string) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const updateProfileStatus = async (userId: string, status: string) => {
  try {
    const res = await api.post(`users/status?userId=${userId}&status=${status}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const getLoginHistory = async (
  id: string,
  startDate: string,
  endDate: string,
  page: number,
) => {
  try {
    const res = await api.get(
      `/login-history?userId=${id}&startDate=${startDate}&endDate=${endDate}&page=${page}`
    );
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const getProfileStats = async () => {
  try {
    const res = await api.get(`/users/stats/data`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};
