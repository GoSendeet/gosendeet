import { AxiosError } from "axios";

import { api } from "./axios";

type ApiError = { message?: string };

export type ClientCredential = {
  id: string;
  clientId: string;
  clientName: string;
  keyPrefix: string;
  scopes: string[];
  status: string;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
  revokedAt: string;
  lastUsedAt: string;
  createdBy: string;
};

export type ClientCredentialCreatePayload = {
  clientId: string;
  name: string;
  scopes: string[];
};

export type ClientCredentialCreateResult = {
  credential: ClientCredential;
  rawSecret: string;
};

const throwApiError = (error: unknown): never => {
  const axiosError = error as AxiosError<ApiError>;
  throw axiosError?.response?.data || { message: (error as Error).message };
};

const toArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [value];
};

const normalizeScopes = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((scope) => String(scope).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((scope) => scope.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeCredential = (item: any): ClientCredential => ({
  id: String(item?.id ?? item?.credentialId ?? item?.keyId ?? ""),
  clientId: String(
    item?.clientId ?? item?.client?.id ?? item?.approvedClientId ?? "",
  ),
  clientName: String(
    item?.clientName ??
      item?.client?.name ??
      item?.approvedClientName ??
      item?.name ??
      "",
  ),
  keyPrefix: String(
    item?.keyPrefix ??
      item?.prefix ??
      item?.clientKeyPrefix ??
      item?.maskedKey ??
      "",
  ),
  scopes: normalizeScopes(item?.scopes),
  status: String(
    item?.status ??
      (item?.revoked || item?.isRevoked ? "REVOKED" : "ACTIVE"),
  ).toUpperCase(),
  isRevoked: Boolean(
    item?.isRevoked ?? item?.revoked ?? item?.status === "REVOKED",
  ),
  createdAt: String(item?.createdAt ?? item?.dateCreated ?? ""),
  updatedAt: String(item?.updatedAt ?? ""),
  revokedAt: String(item?.revokedAt ?? ""),
  lastUsedAt: String(item?.lastUsedAt ?? item?.lastUsed ?? ""),
  createdBy: String(item?.createdBy ?? item?.creator ?? ""),
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

const getRawSecret = (payload: any): string => {
  return String(
    payload?.rawSecret ??
      payload?.secret ??
      payload?.clientSecret ??
      payload?.plainTextSecret ??
      payload?.data?.rawSecret ??
      payload?.data?.secret ??
      payload?.data?.clientSecret ??
      payload?.data?.plainTextSecret ??
      "",
  );
};

const getCredentialPayload = (payload: any): any => {
  return payload?.credential ?? payload?.data?.credential ?? payload?.data ?? payload;
};

export const getClientCredentials = async (): Promise<ClientCredential[]> => {
  try {
    const res = await api.get("/client-credentials");
    return getListPayload(res.data).map(normalizeCredential);
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const createClientCredential = async (
  data: ClientCredentialCreatePayload,
): Promise<ClientCredentialCreateResult> => {
  try {
    const res = await api.post("/client-credentials", data);
    return {
      credential: normalizeCredential(getCredentialPayload(res.data)),
      rawSecret: getRawSecret(res.data),
    };
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const revokeClientCredential = async (id: string) => {
  try {
    const res = await api.post(`/client-credentials/${id}/revoke`);
    return res.data;
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const updateClientCredentialScopes = async (
  id: string,
  scopes: string[],
) => {
  try {
    const res = await api.patch(`/client-credentials/${id}/scopes`, { scopes });
    return normalizeCredential(getCredentialPayload(res.data));
  } catch (error: unknown) {
    return throwApiError(error);
  }
};

export const getClientCredentialStats = (credentials: ClientCredential[]) => {
  const list = toArray(credentials);

  return {
    total: list.length,
    active: list.filter((credential) => !credential.isRevoked).length,
    revoked: list.filter((credential) => credential.isRevoked).length,
  };
};
