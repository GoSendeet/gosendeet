import { api } from "./axios";
import { throwApiError } from "@/lib/errorHandling";

export const getAllNotifications = async (page:number) => {
  try {
    const res = await api.get(`/notifications?page=${page}`);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const updateNotificationStatus = async (data: any) => {
  try {
    const res = await api.put(`/notifications?status=read`, data);
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};

export const deleteNotifications = async (data: any) => {
  try {
    const res = await api.delete(`/notifications`, {data});
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};
