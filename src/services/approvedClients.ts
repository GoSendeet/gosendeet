import { AxiosError } from "axios";

import { api } from "./axios";

type ApiError = { message?: string };

export type ApprovedClient = {
  id: string;
  name: string;
  email: string;
  description: string;
  status: string;
  createdAt: string;
  approvedAt: string;
  rejectedAt: string;
  updatedAt: string;
  approvedBy: string;
};

export type CreateApprovedClientPayload = {
  name: string;
  email: string;
  description?: string;
};

const throwApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<ApiError>;
  throw axiosError?.response?.data || { message: (error as Error).message };
};

const normalizeStatus = (value: unknown) =>
  String(value ?? "PENDING")
    .trim()
    .toUpperCase();

const normalizeClient = (item: any): ApprovedClient => ({
  id: String(item?.id ?? item?.clientId ?? item?.approvedClientId ?? ""),
  name: String(item?.name ?? item?.clientName ?? ""),
  email: String(item?.email ?? item?.contactEmail ?? ""),
  description: String(item?.description ?? item?.notes ?? ""),
  status: normalizeStatus(item?.status),
  createdAt: String(item?.createdAt ?? item?.dateCreated ?? ""),
  approvedAt: String(item?.approvedAt ?? ""),
  rejectedAt: String(item?.rejectedAt ?? ""),
  updatedAt: String(item?.updatedAt ?? ""),
  approvedBy: String(item?.approvedBy ?? item?.reviewedBy ?? ""),
});

const getListPayload = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.content)) {
    return payload.data.content;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  return [];
};

const getItemPayload = (payload: any) =>
  payload?.client ?? payload?.data?.client ?? payload?.data ?? payload;

export const getApprovedClients = async (): Promise<ApprovedClient[]> => {
  try {
    const res = await api.get("/clients");
    return getListPayload(res.data).map(normalizeClient);
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const createApprovedClient = async (
  data: CreateApprovedClientPayload,
): Promise<ApprovedClient> => {
  try {
    const res = await api.post("/clients", data);
    return normalizeClient(getItemPayload(res.data));
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const approveClient = async (id: string): Promise<ApprovedClient> => {
  
  try {
    const res = await api.patch(`/clients/${id}/approve`);
    return normalizeClient(getItemPayload(res.data));
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const rejectClient = async (id: string): Promise<ApprovedClient> => {
  try {
    const res = await api.patch(`/clients/${id}/reject`);
    return normalizeClient(getItemPayload(res.data));
  } catch (error: unknown) {
    return throwApiError(error);
  }
};
